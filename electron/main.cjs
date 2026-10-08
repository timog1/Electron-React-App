const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { EventEmitter } = require("node:events");
const steamworks = require("steamworks.js");
const { promises: fs } = require("node:fs");

let steam;
let mainWindow;
let currentLobby = null;
let packetPump = null;

// Internal event bus: the packet pump emits here, everything else just listens.
const steamEvents = new EventEmitter();

// networking.SendType.Reliable (Reliable packets can be up to 1 MB)
const P2P_RELIABLE = 2;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getContentPath() {
    if (!app.isPackaged) {
        return path.join(__dirname, "..", "content");
    }
    return path.join(path.dirname(app.getPath("exe")), "content");
}

function sendToRenderer(channel, payload) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, payload);
    }
}

// PlayerSteamId is an object { steamId64, steamId32, accountId } -> use steamId64
function getLobbyData() {
    if (!currentLobby) {
        return null;
    }

    return {
        id: currentLobby.id.toString(),
        owner: currentLobby.getOwner().steamId64.toString(),
        members: currentLobby.getMembers().map((member) => ({
            id: member.steamId64.toString()
        })),
        game: currentLobby.getData("game"),
        state: currentLobby.getData("state"),
        gameOptions: currentLobby.getData("gameOptions")
    };
}

// Registering a callback must never crash the app (e.g. older steamworks.js builds)
function safeRegister(callbackName, handler) {
    try {
        const id = steam.callback.SteamCallback[callbackName];
        if (id === undefined) {
            console.warn(`Steam callback "${callbackName}" not available in this steamworks.js version`);
            return;
        }
        steam.callback.register(id, handler);
    } catch (error) {
        console.warn(`Could not register Steam callback "${callbackName}":`, error);
    }
}

/* -------------------------------------------------------------------------- */
/*  P2P messaging                                                             */
/* -------------------------------------------------------------------------- */

function sendTo(steamId, message) {
    const data = Buffer.from(JSON.stringify(message), "utf8");
    return steam.networking.sendP2PPacket(BigInt(steamId), P2P_RELIABLE, data);
}

function broadcast(message) {
    if (!currentLobby) {
        return false;
    }

    const me = steam.localplayer.getSteamId().steamId64;
    let ok = true;

    for (const member of currentLobby.getMembers()) {
        if (member.steamId64 === me) {
            continue; // don't send to ourselves
        }
        ok = sendTo(member.steamId64, message) && ok;
    }

    return ok;
}

function startNetworking() {
    // Steam tells us when someone contacts us for the first time.
    // Without accepting the session, their packets are dropped.
    safeRegister("P2PSessionRequest", (request) => {
        console.log("P2P session request from", request.remote.toString());
        steam.networking.acceptP2PSession(request.remote);
    });

    // Steam has no "packet received" event, so ONE timer reads packets
    // and turns them into events. Nothing else needs to poll.
    packetPump = setInterval(() => {
        const size = steam.networking.isP2PPacketAvailable();
        if (!size) {
            return;
        }

        const packet = steam.networking.readP2PPacket(size);

        let message;
        try {
            message = JSON.parse(packet.data.toString("utf8"));
        } catch {
            console.warn("Received a packet that isn't valid JSON, ignoring");
            return;
        }

        steamEvents.emit("message", {
            from: packet.steamId.steamId64.toString(), // bigint -> string for IPC
            message
        });
    }, 5);

    steamEvents.on("message", (msg) => {
        console.log("Received:", msg);
        sendToRenderer("steam:message", msg);
    });

    // Push lobby changes (members joining/leaving, lobby data) to the renderer
    safeRegister("LobbyDataUpdate", () => {
        sendToRenderer("steam:lobbyUpdated", getLobbyData());
    });
    safeRegister("LobbyChatUpdate", () => {
        sendToRenderer("steam:lobbyUpdated", getLobbyData());
    });
}

/* -------------------------------------------------------------------------- */
/*  IPC handlers                                                              */
/* -------------------------------------------------------------------------- */

function registerIpcHandlers() {
    ipcMain.handle("steam:getPlayerName", () => {
        return steam.localplayer.getName();
    });

    ipcMain.handle("steam:getSteamId", () => {
        return steam.localplayer.getSteamId().steamId64.toString();
    });

    ipcMain.handle("read-directory", async (_, relativePath = "") => {
        const contentPath = getContentPath();
        const directory = path.resolve(contentPath, relativePath);

        // Don't allow escaping the content folder with "../"
        if (!directory.startsWith(path.resolve(contentPath))) {
            throw new Error("Invalid path");
        }

        const entries = await fs.readdir(directory, { withFileTypes: true });

        return entries.map((entry) => ({
            name: entry.name,
            path: path.join(relativePath, entry.name),
            isDirectory: entry.isDirectory()
        }));
    });
    ipcMain.handle("read-file", async (_, relativePath) => {
        const contentPath = getContentPath();
        const filePath = path.resolve(contentPath, relativePath);

        // Don't allow escaping the content folder with "../"
        if (!filePath.startsWith(path.resolve(contentPath))) {
            throw new Error("Invalid path");
        }

        return await fs.readFile(filePath, "utf8");
    });

    /* ---- Lobby ---- */

    ipcMain.handle("steam:createLobby", async () => {
        const lobby = await steam.matchmaking.createLobby(
            steam.matchmaking.LobbyType.FriendsOnly,
            8
        );

        currentLobby = lobby;

        lobby.setData("game", "none");
        lobby.setData("state", "waiting");


        return getLobbyData();
    });

    ipcMain.handle("steam:joinLobby", async (_event, lobbyId) => {
        const lobby = await steam.matchmaking.joinLobby(BigInt(lobbyId));

        currentLobby = lobby;

        return getLobbyData();
    });

    ipcMain.handle("steam:leaveLobby", () => {
        if (!currentLobby) {
            return;
        }

        currentLobby.leave();
        currentLobby = null;
    });

    ipcMain.handle("steam:getLobby", () => {
        return getLobbyData();
    });

    /* ---- Messaging ---- */

    // Send to one player
    ipcMain.handle("send-message", (_, steamId, message) => {
        const success = sendTo(steamId, message);
        console.log("Sending to", steamId, message, "->", success);
        return success;
    });
    ipcMain.handle("steam:setLobbyData", (_, key, value) => {
        if (!currentLobby) {
            throw new Error("No current lobby");
        }

        currentLobby.setData(key, value);

        return true;
    });

    // Send to everyone in the lobby except yourself
    ipcMain.handle("broadcast-message", (_, message) => {
        const success = broadcast(message);
        console.log("Broadcasting", message, "->", success);
        return success;
    });
}

/* -------------------------------------------------------------------------- */
/*  Window + app lifecycle                                                    */
/* -------------------------------------------------------------------------- */

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:5173");

    steamworks.electronEnableSteamOverlay();
}

app.whenReady().then(() => {
    try {
        steam = steamworks.init(480);

        console.log("Steam initialized!");
        console.log("Steam player:", steam.localplayer.getName());

        registerIpcHandlers();
        startNetworking();
        createWindow();
    } catch (error) {
        console.error("Steam initialization failed:", error);
        app.quit();
    }
});

app.on("before-quit", () => {
    if (packetPump) {
        clearInterval(packetPump);
    }
    if (currentLobby) {
        try {
            currentLobby.leave();
        } catch {
            // ignore, we're quitting anyway
        }
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
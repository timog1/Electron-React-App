const { contextBridge, ipcRenderer } = require("electron");

function subscribe(channel, callback) {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on(channel, handler);

    return () => {
        ipcRenderer.removeListener(channel, handler);
    };
}

const fileSystem = {
    readDirectory: (relativePath = "") =>
        ipcRenderer.invoke("read-directory", relativePath),

    readFile: (relativePath) =>
        ipcRenderer.invoke("read-file", relativePath),
};

contextBridge.exposeInMainWorld("steam", {
    /* ---- Player ---- */
    getPlayerName: () =>
        ipcRenderer.invoke("steam:getPlayerName"),

    getSteamId: () =>
        ipcRenderer.invoke("steam:getSteamId"),

    setLobbyData: (key, value) =>
        ipcRenderer.invoke(
            "steam:setLobbyData",
            key,
            value
        ),

    /* ---- Files ---- */
    readDirectory: fileSystem.readDirectory,
    readFile: fileSystem.readFile,

    /* ---- Lobby ---- */
    createLobby: () =>
        ipcRenderer.invoke("steam:createLobby"),

    joinLobby: (lobbyId) =>
        ipcRenderer.invoke(
            "steam:joinLobby",
            String(lobbyId)
        ),

    leaveLobby: () =>
        ipcRenderer.invoke("steam:leaveLobby"),

    getLobby: () =>
        ipcRenderer.invoke("steam:getLobby"),

    /* ---- Messaging ---- */
    sendMessage: (steamId, message) =>
        ipcRenderer.invoke(
            "send-message",
            String(steamId),
            message
        ),

    broadcastMessage: (message) =>
        ipcRenderer.invoke(
            "broadcast-message",
            message
        ),

    /* ---- Events ---- */
    onMessage: (callback) =>
        subscribe("steam:message", callback),

    onLobbyUpdated: (callback) =>
        subscribe("steam:lobbyUpdated", callback)
});

/*
 * Optional: separates filesystem API from Steam API.
 * This allows window.fileSystem.readFile(...)
 * and window.fileSystem.readDirectory(...)
 */
contextBridge.exposeInMainWorld("fileSystem", fileSystem);
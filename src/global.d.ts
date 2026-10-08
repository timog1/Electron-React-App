export {};

declare global {
    interface Window {
        steam: {
            /* Player */
            getPlayerName(): Promise<string>;
            getSteamId(): Promise<string>;

            /* Lobby */
            createLobby(): Promise<SteamLobby | null>;
            joinLobby(lobbyId: string): Promise<SteamLobby | null>;
            getLobby(): Promise<SteamLobby | null>;
            leaveLobby(): Promise<void>;

            /* Messaging */
            sendMessage(steamId: string, message: unknown): Promise<boolean>;
            broadcastMessage(message: unknown): Promise<boolean>;
            setLobbyData(key, value): Promise;
            /* Events - each returns an unsubscribe function */
            onMessage<T = unknown>(
                callback: (msg: SteamIncomingMessage<T>) => void
            ): () => void;
            onLobbyUpdated(
                callback: (lobby: SteamLobby | null) => void
            ): () => void;
        };

    }
    interface SteamIncomingMessage<T = unknown> {
        /** SteamID64 of the sender */
        from: string;
        type: string;
        message: T;
    }

    interface SteamLobbyMember {
        id: string;
        name: string;
    }

    interface SteamLobby {
        id: string;
        owner: string;
        members: SteamLobbyMember[];
        game: string | null;
        state: string | null;
        gameOptions: string | null;
    }
    interface FileEntry {
        name: string;
        path: string;
        isDirectory: boolean;
    }

    interface Window {
        fileSystem: {
            readDirectory: (path: string) => Promise<FileEntry[]>;
            readFile: (relativePath) => Promise<string>,
        };

    }
}
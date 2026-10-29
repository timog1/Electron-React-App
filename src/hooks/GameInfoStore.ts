export interface GameInfoMessage {
    game: string;
    contentVersion: number;
    round: number;
    info: string;
}

type GameRounds = Map<number, string>;
type GameVersions = Map<number, GameRounds>;

// game -> contentVersion -> round -> info
const store = new Map<string, GameVersions>();

// Alle Komponenten, die Store-Änderungen beobachten
const listeners = new Set<() => void>();

function notifyListeners() {
    listeners.forEach((listener) => listener());
}

/**
 * Speichert die Informationen einer Runde.
 */
export function setGameInfo(message: GameInfoMessage): void {
    let versions = store.get(message.game);

    if (!versions) {
        versions = new Map();
        store.set(message.game, versions);
    }

    let rounds = versions.get(message.contentVersion);

    if (!rounds) {
        rounds = new Map();
        versions.set(message.contentVersion, rounds);
    }

    // Unveränderte Daten müssen keine Updates auslösen.
    if (rounds.get(message.round) === message.info) {
        return;
    }

    rounds.set(message.round, message.info);

    notifyListeners();
}

/**
 * Liest die Informationen einer bestimmten Runde.
 */
export function getGameInfo(
    game: string,
    contentVersion: number,
    round: number
): string | undefined {
    return store
        .get(game)
        ?.get(contentVersion)
        ?.get(round);
}

/**
 * Abonniert Änderungen am Store.
 */
export function subscribeGameInfo(
    listener: () => void
): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

/**
 * Entfernt alle Daten einer bestimmten Inhaltsversion.
 */
export function clearGameInfo(
    game: string,
    contentVersion: number
): void {
    const versions = store.get(game);

    if (!versions?.has(contentVersion)) {
        return;
    }

    versions.delete(contentVersion);

    if (versions.size === 0) {
        store.delete(game);
    }

    notifyListeners();
}
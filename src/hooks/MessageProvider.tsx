
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    type ReactNode,
} from "react";

import type {
    GameMessage,
    GameMessageMap,
} from "./messages.ts";

type GameMessageType = keyof GameMessageMap;

type MessageOfType<T extends GameMessageType> = Extract<
    GameMessage,
    { type: T }
>;

type MessageHandler<T extends GameMessageType> = (
    message: MessageOfType<T>,
    from: string
) => void;

type AnyMessageHandler = (
    message: GameMessage,
    from: string
) => void;

type IncomingMessage = {
    from: string;
    message: string;
};

type MessageContextType = {
    subscribe: <T extends GameMessageType>(
        type: T,
        handler: MessageHandler<T>
    ) => () => void;
};

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({
    children,
}: {
    children: ReactNode;
}) {
    const handlersRef = useRef(
        new Map<GameMessageType, Set<AnyMessageHandler>>()
    );

    const subscribe = useCallback(
        <T extends GameMessageType,>(
            type: T,
            handler: MessageHandler<T>
        ) => {
            let handlers = handlersRef.current.get(type);

            if (!handlers) {
                handlers = new Set<AnyMessageHandler>();
                handlersRef.current.set(type, handlers);
            }

            // Die Typumwandlung bleibt auf den internen Wrapper begrenzt.
            const wrappedHandler: AnyMessageHandler = (message, from) => {
                handler(message as MessageOfType<T>, from);
            };

            handlers.add(wrappedHandler);

            return () => {
                handlers!.delete(wrappedHandler);

                if (handlers!.size === 0) {
                    handlersRef.current.delete(type);
                }
            };
        },
        []
    );

    useEffect(() => {
        const unsubscribe = window.steam.onMessage(
            (incoming: IncomingMessage) => {
                let parsed: unknown;

                try {
                    parsed = JSON.parse(incoming.message);
                } catch {
                    // Ungültiges JSON ignorieren.
                    return;
                }

                // Grundlegende Prüfung der eingehenden Daten.
                if (
                    !parsed ||
                    typeof parsed !== "object" ||
                    !("type" in parsed) ||
                    typeof parsed.type !== "string" ||
                    !("payload" in parsed)
                ) {
                    return;
                }

                // Der empfangene String ist zunächst nicht vertrauenswürdig.
                const type = parsed.type as GameMessageType;

                const handlers = handlersRef.current.get(type);

                if (!handlers) {
                    // Für diesen Nachrichtentyp gibt es keine Listener.
                    return;
                }

                // Die Laufzeitprüfung oben bestätigt noch nicht,
                // dass das Payload dem jeweiligen TypeScript-Typ entspricht.
                handlers.forEach((handler) => {
                    handler(parsed as GameMessage, incoming.from);
                });
            }
        );

        return unsubscribe;
    }, []);

    return (
        <MessageContext.Provider value={{ subscribe }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useGameMessage<T extends GameMessageType>(
    type: T,
    handler: MessageHandler<T>
) {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error(
            "useGameMessage muss innerhalb von MessageProvider verwendet werden."
        );
    }

    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        return context.subscribe(type, (message, from) => {
            handlerRef.current(message, from);
        });
    }, [context.subscribe, type]);
}

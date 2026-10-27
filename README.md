# Partygame-Sammlung (Steam P2P)

Eine Sammlung von Partyspielen für Freunde, gebaut mit Electron, React und TypeScript.
Die Spieler verbinden sich über Steam P2P miteinander, ein eigener Server ist nicht nötig.

> 🚧 **Work in Progress:** Das Projekt ist in aktiver Entwicklung.
> Es gibt noch Bugs, und nicht alle Spiele sind fertig.

## Spiele

### Tierlist (spielbar, noch buggy)
Jeder Spieler hat eine eigene Rangliste von 1 bis 10. Die Begriffe werden den Plätzen
zugeordnet, und jeder Platz kann nur einmal vergeben werden.
falschen Zustand geraten.

### [Name des 2. Spiels] (in Entwicklung)
[Ein Satz, worum es geht.] Dieses Spiel ist gerade in Arbeit und noch nicht spielbar.

## Tech-Stack
- Electron
- React + TypeScript + Vite
- Steam P2P (Netzwerk)

## Bekannte Probleme
- Tierlist: Prüfung fehlt noch, ob ein Spieler schon alles ausgewählt hat
- Das zweite Spiel ist noch nicht fertig

## Starten

Voraussetzungen:
- Node.js
- Steam-Client läuft im Hintergrund und ist eingeloggt

Installation (einmalig):

    npm install

Dann in **zwei getrennten Terminals** (Reihenfolge beachten):

    # Terminal 1: Vite-Dev-Server
    npm run dev

    # Terminal 2: Electron-App
    npm run electron

> Aktuell ist das Projekt nur für die Entwicklung gedacht. Es gibt noch keinen fertigen Build.

## Roadmap
- [ ] UI/Design erstellen
- [ ] Tierlist-Bugs beheben
- [ ] Zweites Spiel fertigstellen
- [ ] Weitere Spiele hinzufügen
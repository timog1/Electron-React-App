




export function place_Image(setPlacedImages: (arg0: (prev: any) => any) => void, round: number, row: unknown, player: unknown, currentImage: string){
    setPlacedImages(prev => {
        const existing = prev.find(
            (image: { id: number; player: unknown; }) => image.id === round && image.player === player
        );

        if (existing) {
            // Bild verschieben
            return prev.map((image: { id: number; player: unknown; }) =>
                image.id === round && image.player === player
                    ? { ...image, row, player }
                    : image
            );
        }

        // Bild zum ersten Mal platzieren
        return [
            ...prev,
            {
                id: round,
                media: currentImage,
                row,
                player,
            },
        ];
    });
}
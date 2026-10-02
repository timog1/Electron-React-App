




export function place_Image(setPlacedImages: (arg0: (prev: any) => any) => void, round, row, player, currentImage){
    setPlacedImages(prev => {
        const existing = prev.find(
            image => image.id === round && image.player === player
        );

        if (existing) {
            // Bild verschieben
            return prev.map(image =>
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
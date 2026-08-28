import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';

function EbitenGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(
        () => {
            let isMounted = true;

            const loadGame = async () => {
                try {
                    const script = document.createElement('script');
                    script.src = '/Monstersweeper/wasm_exec.js';
                    document.body.appendChild(script);

                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                    });

                    // @ts-expect-error - Go is defined in wasm_exec.js
                    const go = new Go();
                    const wasmBytes = await fetch('/Monstersweeper/monstersweeper-game.wasm');
                    const wasmArray = await wasmBytes.arrayBuffer();

                    const result = await WebAssembly.instantiate(wasmArray, go.importObject);
                    go.run(result.instance);

                    if (isMounted) {
                        setIsLoading(false);
                    }
                } catch (err: unknown) {
                    console.error('Failed to load WASM:', err);
                    if (isMounted) {
                        if (err instanceof Error) {
                            setError(err.message);
                        } else if (typeof err === 'string') {
                            setError(err);
                        } else {
                            setError('An unknown error occurred while loading the game');
                        }
                        setIsLoading(false);
                    }
                }
            };

            loadGame();

            return () => {
                isMounted = false;
                const script = document.querySelector('script[src="/game/wasm_exec.js"]');
                if (script) script.remove();
            };
        }, []
    );

    if (error) {
        return <div>Error loading game: {error}</div>;
    }
    if (isLoading) {
        return <div>Loading game...</div>;
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                id="ebiten-canvas"
                style={{
                    width: '100%',
                    height: '100% - 120px',
                    display: 'block'
                }}
            />
        </div>
    );
}

export function GamesPage() {
    return (
        <>
            <Header />
            <EbitenGame />
        </>
    );
}
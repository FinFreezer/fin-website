import { Header } from '../components/Header';
import './GamesPage.css'

function EbitenGame() {
    return (
        <div className="games-page">
            <iframe
                className="game-frame"
                src="/Monstersweeper/index.html"
                title="Monstersweeper"
                allow="autoplay; fullscreen; pointer-lock"
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
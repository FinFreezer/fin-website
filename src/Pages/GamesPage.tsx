import { Header } from '../components/Header';
import type { UserType, ReactUserSetter } from '../utils/userTypeDef';
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

export function GamesPage({ activeUser, setActiveUser }: 
    {
        activeUser: UserType | null,
        setActiveUser: ReactUserSetter,
    }
) {
    return (
        <>
            <Header activeUser={activeUser} setActiveUser={setActiveUser} />
            <EbitenGame />
        </>
    );
}
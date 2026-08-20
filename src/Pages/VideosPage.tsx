import axios from 'axios';
import { Header } from '../components/Header';
import './VideosPage.css'

export function VideosPage() {
    const displayVideos = async () => {
        const stream = await axios.get('/api/stream/Videos/Berserk.mp4')
        await stream.data;
    }

    return(
        <>
            <title>Videos</title>
            <Header />
            <div className="videos-page">
                <video controls width="480">
                    <source src='/api/stream/Videos/Berserk.mp4' />
                </video>
            </div>
        </>
    );
}
import { Header } from '../components/Header';
import './HomePage.css'

export function HomePage() {

    return (
        <>
            <title>Welcome</title>
            <Header />
            <div className="home-page">
                <div className="home-page-body">
                    Page under construction
                </div>
                <iframe width="800" height="600"
                    src="https://www.youtube.com/embed/pNNwudhgvEY" 
                    title="LAID-BACK CAMP SEASON2 - Opening | Seize The Day"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
            </div>
        </>
    );
}
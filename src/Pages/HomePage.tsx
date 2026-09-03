import { Header } from '../components/Header';
import type { UserType, ReactUserSetter } from '../utils/userTypeDef';
import './HomePage.css'

export function HomePage({ activeUser, setActiveUser }: 
    { 
        activeUser: UserType | null, 
        setActiveUser: ReactUserSetter,
    }
) {

    return (
        <>
            <title>Welcome</title>
            <Header activeUser={activeUser} setActiveUser={setActiveUser} />
            <div className="home-page">
                <div className="home-page-body">
                    Page under construction
                    <iframe width="800" height="600"
                        src="https://www.youtube.com/embed/pNNwudhgvEY" 
                        title="LAID-BACK CAMP SEASON2 - Opening | Seize The Day"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
                    </iframe>
                </div>
                <GuestBook />
            </div>
        </>
    );
}

function GuestBook() {
    return (
        <div className="home-guestbook">
            <input className="guestbook-input"
                placeholder='Add greeting'>
            </input>
        </div>
    );
}
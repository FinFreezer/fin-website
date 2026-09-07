import { Header } from '../components/Header';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import axios from 'axios'
import type { UserType, ReactUserSetter } from '../utils/userTypeDef';
import guestBookBanner from '../assets/guestbook-banner.png'
import './HomePage.css'

type ReactStringSetter = React.Dispatch<React.SetStateAction<string>>;
type ReactMessageSetter = React.Dispatch<React.SetStateAction<GuestbookMessageType[]>>;
interface GuestbookMessageType {
    message: string;
    timestamp: string;
    author: string | null;
    id: `${string}-${string}-${string}-${string}-${string}`;
}

interface GuestbookBackend {
    ID: `${string}-${string}-${string}-${string}-${string}`;
    CreatedAt: string;
    UpdatedAt: string;
    Author: string;
    Content: string;
    Authorid: `${string}-${string}-${string}-${string}-${string}` | null;
}

export function HomePage({ activeUser, setActiveUser }:
    {
        activeUser: UserType | null,
        setActiveUser: ReactUserSetter,
    }
) {
    /*const messages = localStorage.getItem('messages');
    if (messages !== null) {
        messageStorage = JSON.parse(messages);
    }*/

    const [guestbookLoading, setGuestbookLoading] = useState(true);
    const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessageType[]>([]);
    const [guestbookInput, setGuestbookInput] = useState('');

    useEffect(
        () => {
            const messageStorage: GuestbookMessageType[] = [];
            const loadMessages = async () => {
                const messages = await axios.get("/api/getEntries");

                messages.data.messages.forEach(
                    (message: GuestbookBackend) => {
                        const newMessage: GuestbookMessageType = {
                            message: message.Content,
                            timestamp: message.CreatedAt,
                            author: message.Author,
                            id: message.ID,
                        }
                        messageStorage.push(newMessage);
                    }
                );
            }
            loadMessages();
            setGuestbookLoading(false);
            setGuestbookMessages(messageStorage);
        }, []
    )

    function SendMessage() {
        const timeDisplay = dayjs(dayjs().valueOf()).format('DD/MM/YYYY - HH:mm');
        const newMessage: GuestbookMessageType = {
            message: guestbookInput,
            timestamp: timeDisplay,
            author: activeUser?.Username || 'Guest',
            id: crypto.randomUUID(),
        }
        const addToDatabase = async (message: GuestbookMessageType) => {
            const response = await axios.post("/api/addEntry",
                {
                    id: message.id,
                    author: message.author,
                    content: message.message,
                }
            );
            console.log(`Received reply with message ${response.data} and status ${response.status}.`)
        }
        const newGuestbookMessages = [
            ...guestbookMessages,
            newMessage,
        ]
        addToDatabase(newMessage);
        setGuestbookMessages(newGuestbookMessages);
        setGuestbookInput('');
    }

    function WipeGuestbook() {
        const wipeDatabase = async () => {
            const response = await axios.post("/api/wipeEntries", { hasPrivilege: activeUser?.Admin });
            console.log(`Received reply with message ${response.data} and status ${response.status}.`);
        }
        wipeDatabase();
        setGuestbookMessages([]);
    }

    return (
        <>
            <title>Welcome</title>
            <Header activeUser={activeUser} setActiveUser={setActiveUser} />
            <div className="home-page">
                <div className="home-page-body">
                    <div className="welcome-display">
                        <p className="welcome-display-title">Page under construction</p>
                        {activeUser?.Admin && <button className="guestbook-clear-button" onClick={WipeGuestbook}>Clear guestbook</button>}
                        <iframe width="800" height="600"
                            src="https://www.youtube.com/embed/pNNwudhgvEY"
                            title="LAID-BACK CAMP SEASON2 - Opening | Seize The Day"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
                        </iframe>
                    </div>
                    <GuestBook
                        sendMessage={SendMessage}
                        guestbookInput={guestbookInput}
                        setGuestbookInput={setGuestbookInput}
                        guestbookMessages={guestbookMessages}
                        setGuestbookMessages={setGuestbookMessages}
                        activeUser={activeUser}
                        guestbookLoading={guestbookLoading} />
                    <AboutMe />
                </div>

            </div>
        </>
    );
}

function GuestBook({
    sendMessage,
    guestbookInput,
    setGuestbookInput,
    guestbookMessages,
    setGuestbookMessages,
    activeUser,
    guestbookLoading,
}: {
    sendMessage: () => void,
    guestbookInput: string,
    setGuestbookInput: ReactStringSetter,
    guestbookMessages: GuestbookMessageType[],
    setGuestbookMessages: ReactMessageSetter,
    activeUser: UserType | null,
    guestbookLoading: boolean,
}) {
    return (
        <div className="home-guestbook">
            <p className="guestbook-title">Guestbook</p>
            <img className="guestbook-header"
                alt="Header image for guestbook"
                src={guestBookBanner}
                title="Banner" >
            </img>
            <input className="guestbook-input"
                placeholder='Add greeting'
                value={guestbookInput}
                onChange={(e) => { setGuestbookInput(e.target.value) }}
                onKeyDown={
                    (e) => {
                        if (e.key === 'Enter') { setGuestbookInput(guestbookInput); sendMessage(); }
                        else if (e.key === 'Escape') { setGuestbookInput(''); }
                    }
                }>
            </input>
            <div className="message-display">
                {
                    guestbookLoading ? (
                        <p>Loading Guestbook</p>
                    ) : (
                        <GuestbookMessageDisplay guestbookMessages={guestbookMessages}
                            activeUser={activeUser}
                            setGuestbookMessages={setGuestbookMessages}
                            guestbookLoading={guestbookLoading} />
                    )
                }
            </div>
        </div>
    );
}

function GuestbookMessageDisplay({ guestbookMessages, activeUser, setGuestbookMessages, guestbookLoading }:
    {
        guestbookMessages: GuestbookMessageType[],
        activeUser: UserType | null,
        setGuestbookMessages: ReactMessageSetter,
        guestbookLoading: boolean,
    }) {

    function ClearMessage(messageId: `${string}-${string}-${string}-${string}-${string}`) {
        const updatedMessages = guestbookMessages.filter(
            (message) => message.id !== messageId
        );
        const messageToRemove = guestbookMessages.filter(
            (message) => message.id === messageId
        );
        const removeFromDatabase = async (message: GuestbookMessageType) => {
            const response = await axios.post("/api/deleteEntry", { id: message.id });
            console.log(`Received reply with message ${response.data} and status ${response.status}.`)
        }
        if (messageToRemove.length > 1) {
            console.log("Fatal error: Potential clash in unique IDs found.");
            return
        }
        removeFromDatabase(messageToRemove[0]);
        setGuestbookMessages(updatedMessages);
    }
    if (guestbookLoading) {
        return (
            <>
                <p>Fetching guestbook data...</p>
            </>
        );
    }
    console.log(guestbookMessages);
    if (activeUser?.Admin) {
        return (
            <>
                {guestbookMessages.map(
                    (message) => {
                        return (
                            <div className="guestbook-message" key={message.id}>
                                <p>
                                    {message.message}
                                    <button
                                        className="delete-message-button"
                                        onClick={() => { ClearMessage(message.id); }}>
                                    </button>
                                </p>
                                <p className="message-timestamp">Sent at {message.timestamp} by {message.author}</p>
                            </div>
                        );
                    }
                )}
            </>
        );
    }
    return (
        <>
            {guestbookMessages.map(
                (message) => {
                    return (
                        <div className="guestbook-message" key={message.id}>
                            <p>{message.message}</p>
                            <p className="message-timestamp">Sent at {message.timestamp} by {message.author}</p>
                        </div>
                    );
                }
            )}
        </>
    );
}

function AboutMe() {
    return (
        <div className="about-me-display">
            <time>Updated 07/09/2026</time>
            <h2>Author Info</h2>
            
            <p>Author: Fin</p>
            <p>Project purpose: Familiarizing self with HTTP servers with a little of front-end development.</p>
            <p>Source code available at:</p>
            <ul>
                <li><a href="https://github.com/FinFreezer/homeserver-REST"> Backend </a></li>
                <li><a href="https://github.com/FinFreezer/fin-website"> Frontend</a></li>
            </ul>
            <p>The backend is written purely in Go, while the front-end uses mainly React TSX with HTML+CSS.</p>
            <p>
                The little Minesweeper clone on the Games page is an older, little project of mine, written
                in Go, using the <a href="https://ebitengine.org/">Ebitengine</a> for development and finally
                compiled into WebAssembly. The source code is 
                available <a href="https://github.com/FinFreezer/monstersweeper">here.</a>
            </p>
            <p><a href="mailto:finfreezer@gmail.com">Contact</a></p>
            
        </div>
    );
}
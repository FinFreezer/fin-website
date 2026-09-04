import { Header } from '../components/Header';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import type { UserType, ReactUserSetter } from '../utils/userTypeDef';
import guestBookBanner from '../assets/guestbook-banner.png'
import './HomePage.css'

type ReactStringSetter = React.Dispatch<React.SetStateAction<string>>;
type ReactMessageSetter = React.Dispatch<React.SetStateAction<GuestbookMessageType[]>>;
interface GuestbookMessageType {
    message: string;
    timestamp: string;
    id: `${string}-${string}-${string}-${string}-${string}`;
}
export function HomePage({ activeUser, setActiveUser }:
    {
        activeUser: UserType | null,
        setActiveUser: ReactUserSetter,
    }
) {
    let messageStorage: GuestbookMessageType[] = [];
    const messages = localStorage.getItem('messages');
    if (messages !== null) {
        messageStorage = JSON.parse(messages);
    }

    const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessageType[]>(messageStorage);
    const [guestbookInput, setGuestbookInput] = useState('');

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(guestbookMessages))
    }, [guestbookMessages])

    function SendMessage() {
        const timeDisplay = dayjs(dayjs().valueOf()).format('DD/MM/YYYY - HH:mm')

        const newGuestbookMessages = [
            ...guestbookMessages,
            {
                message: guestbookInput,
                timestamp: timeDisplay,
                id: crypto.randomUUID()
            }
        ]
        setGuestbookMessages(newGuestbookMessages)
        setGuestbookInput('')
    }

    return (
        <>
            <title>Welcome</title>
            <Header activeUser={activeUser} setActiveUser={setActiveUser} />
            <div className="home-page">
                <div className="home-page-body">
                    Page under construction
                    {activeUser?.Admin && <button className="guestbook-clear-button" onClick={() => { setGuestbookMessages([]) }}>Clear guestbook</button>}
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
                    activeUser={activeUser} />
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
    activeUser 
    } : {
        sendMessage: () => void,
        guestbookInput: string,
        setGuestbookInput: ReactStringSetter,
        guestbookMessages: GuestbookMessageType[],
        setGuestbookMessages: ReactMessageSetter,
        activeUser: UserType | null,
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
                        else if (e.key === 'Escape') { setGuestbookInput('') }
                    }
                }>
            </input>
            <div className="message-display">
                <GuestbookMessageDisplay guestbookMessages={guestbookMessages} activeUser={activeUser} setGuestbookMessages={setGuestbookMessages} />
            </div>
        </div>
    );
}

function GuestbookMessageDisplay({ guestbookMessages, activeUser, setGuestbookMessages }:
    {
        guestbookMessages: GuestbookMessageType[],
        activeUser: UserType | null,
        setGuestbookMessages: ReactMessageSetter
    }) {
    
    function ClearMessage(messageId: `${string}-${string}-${string}-${string}-${string}`) {
        const updatedMessages = guestbookMessages.filter(
            (message) => message.id !== messageId
        );
        setGuestbookMessages(updatedMessages);
    }

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
                                        onClick={() => {ClearMessage(message.id)}}>
                                    </button>
                                </p>
                                <p className="message-timestamp">Sent at {message.timestamp} by Guest</p>
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

                            <p className="message-timestamp">Sent at {message.timestamp} by Guest</p>
                        </div>
                    );
                }
            )}
        </>
    );
}
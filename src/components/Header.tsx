import axios from 'axios';
import { NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import './Header.css'

//type ReactKeyEvent = React.KeyboardEvent<HTMLInputElement>;
type ReactChangeEvent = React.ChangeEvent<HTMLInputElement>;
interface UserType {
    Username: string;
    Admin: boolean;
}

//Header(props) { const cart = props.cart; }
export function Header() {
    const [activeUser, setActiveUser] = useState<UserType | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    function changeSearchInput(event: ReactChangeEvent) {
        setSearchInput(event.target.value);
    }

    const handleLogin = async () => {
        const response = await axios.post(`api/login`, { 
            Name: nameInput, 
            Password: passwordInput, 
            WithToken: false 
        });
        let currentUser = null;
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200) {
            currentUser = {
                Username: nameInput,
                Admin: true,
            }
            setActiveUser(currentUser!);
        }
        setNameInput('');
        setPasswordInput('');
    }

    const handleLogout = () => {
        setActiveUser(null);
    }
    return (
        <>
            <div className="header">
                <div className="left-section">
                    <NavLink to="/" className="home-link header-link">
                        <button className="header-button">
                            Home
                        </button>
                    </NavLink>
                    <NavLink className="videos-link header-link" to="/videos">
                        <button className="header-button">
                            Videos
                        </button>
                    </NavLink>
                    <NavLink className="comics-link header-link" to="/comics">
                        <button className="header-button">
                            Comics
                        </button>
                    </NavLink>
                    <NavLink className="games-link header-link" to="/games">
                        <button className="header-button">
                            Games
                        </button>
                    </NavLink>
                </div>

                <div className="middle-section">
                    <input className="search-bar"
                        type="text"
                        value={searchInput}
                        onChange={changeSearchInput}
                        placeholder="Search"
                    />

                    <button
                        className="search-button"
                        onClick={() => { navigate(`/?search=${searchInput}`) }}>
                    </button>
                </div>

                <div className="right-section">
                    {!activeUser ? (
                        <>
                            <input className="username-bar"
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="username"
                            />
                            <input className="password-bar"
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="password"
                            />
                            <button
                                className="header-button" onClick={handleLogin}>
                                Login
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="header-text">Succesfully logged in.</p>
                            <p className="header-text">Welcome {activeUser!.Username}</p>
                            <button className="header-button" onClick={handleLogout}>LogOut</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
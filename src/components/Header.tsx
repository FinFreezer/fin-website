import axios from 'axios';
import { NavLink, useNavigate } from 'react-router'
import { useState, useEffect, useCallback } from 'react'
import type { UserType, ReactUserSetter } from '../utils/userTypeDef';
import './Header.css'

//type ReactKeyEvent = React.KeyboardEvent<HTMLInputElement>;
type ReactChangeEvent = React.ChangeEvent<HTMLInputElement>;

axios.defaults.withCredentials = true;

//Header(props) { const cart = props.cart; }
export function Header({ activeUser, setActiveUser }:
    {
        activeUser: UserType | null,
        setActiveUser: ReactUserSetter
    }
) {
    //const [activeUser, setActiveUser] = useState<UserType | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const userName = nameInput;
            const passWord = passwordInput;
            const response = await axios.post('/api/register',
                {
                    name: userName,
                    password: passWord
                }
            )
            if (response.status === 200) {
                setNameInput('Registration successful.')
                setTimeout(
                    () => {
                        setNameInput('');
                    }, 2500
                )
            }
            console.log(response.data.reply)
        } catch (error) {
            console.log(error)
        }
    }

    const checkAuthStatus = useCallback(
        async () => {
            try {
                const response = await axios.get("/api/verify")

                if (response.status === 200) {
                    setActiveUser(
                        {
                            Username: response.data.username || 'User',
                            Admin: response.data.authorization || false,
                        }
                    );
                } else {
                    setActiveUser(null);
                }
            } catch (error) {
                console.log(error)
                setActiveUser(null);
            } finally {
                setIsLoading(false)
            }
    }, [setActiveUser]
    );

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

    const handleLogout = async () => {
        try {
            if (activeUser) {
                await axios.post('/api/logout',
                    { name: activeUser.Username },
                    { withCredentials: true },
                );
            } else {
                await axios.post('/api/logout', {}, { withCredentials: true });
            }

            setActiveUser(null);
            navigate("/");
        } catch (error) {
            console.log(error);
            setActiveUser(null);
            navigate("/");
        }

    }

    useEffect(
        () => {
            checkAuthStatus();
        }, [checkAuthStatus]
    );

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
                    {isLoading ? (
                        <p className="header-text">Looking for active session...</p>
                    ) : !activeUser ? (
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
                            <div className="button-row">
                                <button
                                    className="header-button" onClick={handleLogin}>
                                    Login
                                </button>
                                <button
                                    className="header-button" onClick={handleRegister}>
                                    Register User
                                </button>
                            </div>
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
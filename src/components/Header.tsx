import { NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import './Header.css'

//type ReactKeyEvent = React.KeyboardEvent<HTMLInputElement>;
type ReactChangeEvent = React.ChangeEvent<HTMLInputElement>;

//Header(props) { const cart = props.cart; }
export function Header() {
    const navigate = useNavigate();
    const [ searchInput, setSearchInput ] = useState('');

    function changeSearchInput(event: ReactChangeEvent) {
        setSearchInput(event.target.value);
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
                        onClick={() => {navigate(`/?search=${searchInput}`)}}>
                    </button>
                </div>

                <div className="right-section">
                    <input className="username-bar"
                        type="text"
                        placeholder="username"
                    />
                    <input className="password-bar"
                        type="password"
                        placeholder="password"
                    />
                    <button
                        className="header-button">
                            Login
                    </button>
                </div>
            </div>
        </>
    );
}
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
                    <NavLink to="/" className="header-link">
                    Home
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
                    <NavLink className="orders-link header-link" to="/orders">
                        <span className="orders-text">Videos</span>
                    </NavLink>
                </div>
            </div>
        </>
    );
}
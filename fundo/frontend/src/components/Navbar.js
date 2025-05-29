// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../api/AuthService'; // Assuming you have these in AuthService

const Navbar = () => {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated(); // Check authentication status

    const handleLogout = () => {
        logout(); // Clear tokens from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navBrand}>
                <Link to="/" style={styles.navLink}>Fundo</Link>
            </div>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link to="/projects" style={styles.navLink}>Discover Projects</Link>
                </li>
                {loggedIn && ( // Only show if logged in
                    <li style={styles.navItem}>
                        <Link to="/create-project" style={styles.navLink}>Create Project</Link>
                    </li>
                )}
                {!loggedIn ? ( // Show Login/Register if not logged in
                    <>
                        <li style={styles.navItem}>
                            <Link to="/login" style={styles.navLink}>Login</Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link to="/register" style={styles.navLink}>Register</Link>
                        </li>
                    </>
                ) : ( // Show Logout if logged in
                    <li style={styles.navItem}>
                        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    navBrand: {
        fontSize: '1.8em',
        fontWeight: 'bold',
    },
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
    },
    navItem: {
        marginLeft: '25px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.1em',
        transition: 'color 0.3s ease',
    },
    navLinkHover: {
        color: '#ffc107', // Example hover color
    },
    logoutButton: {
        backgroundColor: 'transparent',
        border: '1px solid #ffc107',
        color: '#ffc107',
        padding: '8px 15px',
        borderRadius: '5px',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    logoutButtonHover: {
        backgroundColor: '#ffc107',
        color: '#333',
    },
};

export default Navbar;
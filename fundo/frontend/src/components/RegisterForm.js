// frontend/src/components/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios'; // For registration, we might use plain axios or your 'api' instance
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            // Adjust this URL to your backend's user registration endpoint
            // For DRF Simple JWT, you'd typically have a custom endpoint for user creation.
            // If you don't have one, we'll need to create it in Django.
            // For now, let's assume a /users/ endpoint or similar.
            const response = await axios.post('http://localhost:8000/api/register/', { // Or /api/users/ or similar
                username,
                email,
                password,
            });

            setSuccess("Registration successful! Please log in.");
            console.log("Registration successful:", response.data);
            // Optionally redirect to login page after successful registration
            navigate('/login');

        } catch (err) {
            console.error("Registration failed:", err.response ? err.response.data : err);
            if (err.response && err.response.data) {
                // Display specific error messages from the backend
                if (err.response.data.username) {
                    setError(`Username: ${err.response.data.username.join(' ')}`);
                } else if (err.response.data.email) {
                    setError(`Email: ${err.response.data.email.join(' ')}`);
                } else if (err.response.data.password) {
                    setError(`Password: ${err.response.data.password.join(' ')}`);
                } else {
                    setError(err.response.data.detail || "Registration failed. Please try again.");
                }
            } else {
                setError("Network error or server unavailable.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.form}>
                <h2 style={styles.title}>Register</h2>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <div style={styles.inputGroup}>
                    <label htmlFor="username" style={styles.label}>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Register</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f4f7f6',
    },
    form: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        width: '350px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '25px',
        fontSize: '2em',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1em',
        boxSizing: 'border-box', // Include padding in width
    },
    button: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1.1em',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    error: {
        color: '#dc3545',
        marginBottom: '15px',
        textAlign: 'center',
    },
    success: {
        color: '#28a745',
        marginBottom: '15px',
        textAlign: 'center',
    },
};

export default RegisterForm;
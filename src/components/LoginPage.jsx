import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt with email:', email, 'and password:', password);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Login successful:', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId); // Store the userId
                setMessage('Successfully logged in');
                onLogin();
            } else {
                const error = await res.json();
                console.log('Login failed:', error);
                setMessage(error.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage('An error occurred. Please try again.');
        }
    };
    

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {message && <p>{message}</p>}
                <button type="submit">Login</button>
                <button
                    type="button"
                    onClick={onRegister}
                    className="toggle-button"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

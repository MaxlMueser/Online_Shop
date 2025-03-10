import React, { useState } from 'react';

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch('http://localhost:5000/register', { //
            // 🔹 **Registrierungsfunktion**
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
            onRegister(); // Falls du direkt zur Login-Seite weiterleiten willst
        } else {
            setMessage(data.error || 'Fehler bei der Registrierung');
        }
    };

    return (
        <div>
            <h2>Registrieren</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Benutzername:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Passwort:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Registrieren</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;

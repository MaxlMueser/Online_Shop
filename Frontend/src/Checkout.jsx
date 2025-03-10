import React, { useState } from 'react';
import axios from 'axios';

function Checkout({ items, userId }) {
    const [message, setMessage] = useState('');

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/checkout', { userId });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Fehler bei der Zahlung!');
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            {items.length === 0 ? <p>Dein Warenkorb ist leer!</p> : (
                <>
                    <ul>
                        {items.map(item => (
                            <li key={item.name}>{item.amount} x {item.name} - {item.price}€</li>
                        ))}
                    </ul>
                    <button onClick={handlePayment}>Jetzt bezahlen</button>
                </>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Checkout;





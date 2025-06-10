import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Product from './product';
import ShoppingCard from './shopping-card';
import Checkout from './Checkout';
import Login from './Login';
import Register from './Register';
import Admin from './Admin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import './index.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [items, setItems] = useState([]);

    // 🔹 **Login speichern & Warenkorb laden**
    const handleLogin = (userToken, userId) => {
        setToken(userToken);
        setUserId(userId);
        localStorage.setItem('token', userToken);
        localStorage.setItem('userId', userId);
        loadCart(userId);  // Laden des Warenkorbs nach Login
    };

    // 🔹 **Logout**
    const handleLogout = () => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setItems([]); // Warenkorb zurücksetzen
    };

    // 🔹 **Warenkorb aus MySQL laden**
    const loadCart = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/cart/${userId}`);
            setItems(response.data);
        } catch (error) {
            console.error('Fehler beim Laden des Warenkorbs:', error);
        }
    };

    // 🔹 **Produkt zum Warenkorb hinzufügen**
    const addItem = async (amount, name, price) => {
        try {
            await axios.post('http://localhost:5000/cart', { userId, name, amount, price });
            loadCart(userId);  // Warenkorb neu laden
        } catch (error) {
            console.error('Fehler beim Hinzufügen:', error);
        }
    };

    // 🔹 **Produkt aus Warenkorb entfernen**
    const removeItem = async (name) => {
        try {
            await axios.delete(`http://localhost:5000/cart/${userId}/${name}`);
            loadCart(userId);  // Warenkorb aktualisieren
        } catch (error) {
            console.error('Fehler beim Entfernen:', error);
        }
    };

    // 🔹 **Warenkorb laden, falls Nutzer eingeloggt ist**
    useEffect(() => {
        if (userId) {
            loadCart(userId);
        }
    }, [userId]);

    return (
        <Router>
            <div>
                {!token ? (
                    <Login onLogin={handleLogin} />
                ) : (
                    <>
                        <Navbar />
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                        <Routes>
                            <Route path="/" element={
                                <div className="main-container">
                                    <div className="product-container">
                                        <Product onAdd={() => addItem(1, 'Tomaten', 2.99)} image="tomatoes.jpg" title="Tomaten" description="Füge Tomaten zu deinem Warenkorb hinzu" />
                                        <Product onAdd={() => addItem(1, 'Gurken', 1.99)} image="cucumbers.jpg" title="Gurken" description="Füge Gurken zu deinem Warenkorb hinzu" />
                                        <Product onAdd={() => addItem(1, 'Orangen', 3.99)} image="orange.jpg" title="Orangen" description="Füge Orangen zu deinem Warenkorb hinzu" />
                                        <Product onAdd={() => addItem(1, 'Äpfel', 4.99)} image="apple.jpg" title="Äpfel" description="Füge Äpfel zu deinem Warenkorb hinzu" />
                                    </div>
                                    <ShoppingCard items={items} onRemove={removeItem} />
                                </div>
                            } />
                           <Route path="/register" element={<Register />} />
                           <Route path="/login" element={<Login onLogin={handleLogin} />} />
                           <Route path="/cart" element={<ShoppingCart items={items} onRemove={removeItem} />} />
                           <Route path="/checkout" element={<Checkout items={items} userId={userId} />} />
                           <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </>
                )}
            </div>
        </Router>
    );
}

export default App;

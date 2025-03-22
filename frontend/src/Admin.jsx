import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Fehler beim Laden der Produkte:', error);
        }
    };

    const addProduct = async () => {
        try {
            await axios.post('http://localhost:5000/products', { name, price });
            loadProducts();
        } catch (error) {
            console.error('Fehler beim Hinzufügen:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/products/${id}`);
            loadProducts();
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <input type="text" placeholder="Produktname" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Preis" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button onClick={addProduct}>Produkt hinzufügen</button>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - {product.price}€
                        <button onClick={() => deleteProduct(product.id)}>Löschen</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;

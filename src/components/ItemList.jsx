import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ItemList.css';

const ItemList = () => {
    const { categoryId } = useParams();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '', weight: '', unit: '' });
    const apiBaseUrl = import.meta.env.VITE_BACKEND_API; // Use the environment variable for the base URL

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/items/${categoryId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if required
                },
            });
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else {
                console.error('Failed to fetch items');
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({ ...newItem, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = async () => {
        if (newItem.name && newItem.price && newItem.description && newItem.weight && newItem.unit) {
            try {
                const response = await fetch(`${apiBaseUrl}/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if required
                    },
                    body: JSON.stringify({ ...newItem, categoryId }),
                });
                if (response.ok) {
                    const addedItem = await response.json();
                    setItems([...items, addedItem]);
                    setNewItem({ name: '', price: '', description: '', image: '', weight: '', unit: '' });
                } else {
                    console.error('Failed to add item');
                }
            } catch (error) {
                console.error('Error adding item:', error);
            }
        }
    };

    return (
        <div className="item-list-container">
            <h1>Items</h1>
            <div className="new-item-form">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleInputChange} />
                <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleInputChange} />
                <input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleInputChange} />
                <input type="number" name="weight" placeholder="Weight" value={newItem.weight} onChange={handleInputChange} />
                <input type="text" name="unit" placeholder="Unit" value={newItem.unit} onChange={handleInputChange} />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
            <div className="item-list">
                {items.map((item, index) => (
                    <div className="item" key={index}>
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                            <h2>{item.name}</h2>
                            <p>{item.price}</p>
                            <p>{item.description}</p>
                            <p>{item.weight} {item.unit}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemList;

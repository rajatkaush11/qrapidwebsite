import React, { useState, useEffect } from 'react';
import './Menu.css';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', image: '' });
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    const apiBaseUrl = import.meta.env.VITE_BACKEND_API; // Use the environment variable for the base URL

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/categories/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if required
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategoryClick = () => {
        setShowCategoryInput(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleAddCategory = async () => {
        if (newCategory.name && userId) {
            try {
                const response = await fetch(`${apiBaseUrl}/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if required
                    },
                    body: JSON.stringify({ name: newCategory.name, userId }),
                });
                if (response.ok) {
                    const addedCategory = await response.json();
                    setCategories([...categories, addedCategory]);
                    setNewCategory({ name: '', image: '' });
                    setShowCategoryInput(false);
                } else {
                    console.error('Failed to add category');
                }
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }
    };

    return (
        <div className="menu-container">
            <div className="menu-header">
                <h1>Edit Menu</h1>
                <button className="add-food-category-btn" onClick={handleAddCategoryClick}>+ Add Food Category</button>
            </div>
            <div className="menu-tabs">
                <a href="#" className="active">All</a>
                <a href="#">Popular Items</a>
                <a href="#">Featured</a>
                <a href="#">Combos</a>
                <a href="#">Family Bundles</a>
                <a href="#">Desserts</a>
            </div>
            {showCategoryInput && (
                <div className="new-category-container">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name of the Category" 
                        value={newCategory.name} 
                        onChange={handleInputChange} 
                    />
                    <input 
                        type="text" 
                        name="image" 
                        placeholder="Add Image URL" 
                        value={newCategory.image} 
                        onChange={handleInputChange} 
                    />
                    <button className="add-btn" onClick={handleAddCategory}>Add</button>
                </div>
            )}
            <div className="menu-items">
                {categories.map((category, index) => (
                    <div className="menu-item" key={index}>
                        <img src={category.image} alt={category.name} />
                        <div className="menu-item-details">
                            <h2>{category.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;

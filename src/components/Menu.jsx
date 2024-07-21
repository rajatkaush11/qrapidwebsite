import React from 'react';
import './Menu.css';

const Menu = () => {
    return (
        <div className="menu-container">
            <div className="menu-header">
                <h1>Edit Menu</h1>
                <button className="add-food-category-btn">+ Add Food Category</button>
            </div>
            <div className="menu-tabs">
                <a href="#" className="active">All</a>
                <a href="#">Popular Items</a>
                <a href="#">Featured</a>
                <a href="#">Combos</a>
                <a href="#">Family Bundles</a>
                <a href="#">Desserts</a>
            </div>
            <div className="menu-items">
                <div className="menu-item">
                    <img src="burger.jpg" alt="Classic Burger" />
                    <div className="menu-item-details">
                        <h2>Classic Burger</h2>
                        <p>2 options</p>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="menu-item">
                    <img src="fries.jpg" alt="French Fries" />
                    <div className="menu-item-details">
                        <h2>French Fries</h2>
                        <p>2 options</p>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="menu-item">
                    <img src="ice-cream.jpg" alt="Ice Cream" />
                    <div className="menu-item-details">
                        <h2>Ice Cream</h2>
                        <p>2 options</p>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="menu-item">
                    <img src="fried-chicken.jpg" alt="Fried Chicken" />
                    <div className="menu-item-details">
                        <h2>Fried Chicken</h2>
                        <p>2 options</p>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="menu-item">
                    <img src="salad.jpg" alt="Salad" />
                    <div className="menu-item-details">
                        <h2>Salad</h2>
                        <p>2 options</p>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
            </div>
        </div>
    );
};

export default Menu;

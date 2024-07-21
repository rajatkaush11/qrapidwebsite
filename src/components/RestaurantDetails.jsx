import React, { useState } from 'react';
import './RestaurantDetails.css';

const RestaurantDetails = ({ onSubmit }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [timing, setTiming] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const details = { restaurantName, address, description, timing, token };
    onSubmit(details);
  };

  return (
    <div className="restaurant-details">
      <h2>Restaurant Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name of the Restaurant:</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="e.g., The Great Bistro"
            className={restaurantName ? 'filled' : ''}
          />
        </div>
        <div className="input-group">
          <label>Address of the Restaurant:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 123 Main Street, City"
            className={address ? 'filled' : ''}
          />
        </div>
        <div className="input-group">
          <label>Description of the Restaurant:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Cozy place with a variety of dishes"
            className={description ? 'filled' : ''}
          />
        </div>
        <div className="input-group">
          <label>Timing of the Restaurant:</label>
          <input
            type="text"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            placeholder="e.g., 10 AM - 10 PM"
            className={timing ? 'filled' : ''}
          />
        </div>
        <div className="input-group">
          <label>Token:</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter token"
            className={token ? 'filled' : ''}
          />
        </div>
        <button type="submit">Submit Details</button>
      </form>
    </div>
  );
};

export default RestaurantDetails;

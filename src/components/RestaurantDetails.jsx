import React, { useState } from 'react';
import './RestaurantDetails.css';

const RestaurantDetails = ({ onSubmit }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [timing, setTiming] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantName, address, description, timing, email, password }),
      });

      if (res.ok) {
        setMessage('Registered successfully. Please log in.');
        setTimeout(() => onSubmit(), 2000);
      } else {
        const error = await res.json();
        setMessage(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="restaurant-details">
      <h2>Register Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name of the Restaurant:</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="e.g., The Great Bistro"
            className={restaurantName ? 'filled' : ''}
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., example@example.com"
            className={email ? 'filled' : ''}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={password ? 'filled' : ''}
            required
          />
        </div>
        {message && <p>{message}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RestaurantDetails;

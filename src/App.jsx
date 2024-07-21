import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TableOverview from './components/TableOverview';
import TableDetails from './components/TableDetails';
import Menu from './components/Menu';
import RestaurantDetails from './components/RestaurantDetails';
import './App.css';
import { SignedIn, SignedOut, SignInButton, useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const backendApiUrl = import.meta.env.VITE_CLERK_BACKEND_API;

const App = () => {
  const [tables, setTables] = useState(Array.from({ length: 15 }, (_, index) => `T${index + 1}`));
  const [currentPage, setCurrentPage] = useState('RestaurantDetails');
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableColors, setTableColors] = useState(Array(15).fill('blank'));
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const logToken = async () => {
      if (user) {
        try {
          const token = await getToken();
          console.log('User Token:', token);
          localStorage.setItem('userToken', token); // Store token in local storage
          await createOrUpdateUser(user, token);
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    };
    logToken();
  }, [user, getToken]);

  const createOrUpdateUser = async (user, token) => {
    try {
      console.log('Creating/updating user with email:', user.primaryEmailAddress.emailAddress);
      const res = await axios.post(`${backendApiUrl}/users`, {
        email: user.primaryEmailAddress.emailAddress,
        clerkId: user.id,
        isGoogleUser: true,
        token,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('User created/updated response:', res.data);
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  const handleSubmitRestaurantDetails = async (details) => {
    try {
      const token = localStorage.getItem('userToken'); // Retrieve token from local storage
      console.log('Token to be sent:', token);
      const res = await axios.post(`${backendApiUrl}/restaurants`, details, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Restaurant Details:', res.data);
      setCurrentPage('TableOverview');
    } catch (error) {
      console.error('Error submitting restaurant details:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'RestaurantDetails':
        return <RestaurantDetails onSubmit={handleSubmitRestaurantDetails} />;
      case 'TableOverview':
        return <TableOverview tables={tables} addTable={addTable} onSelectTable={handleSelectTable} tableColors={tableColors} />;
      case 'TableDetails':
        return <TableDetails tableNumber={selectedTable} onBackClick={handleBackClick} onGenerateKOT={handleGenerateKOT} onGenerateBill={handleGenerateBill} onComplete={handleComplete} />;
      case 'Dashboard':
        return <div>Dashboard Content</div>;
      case 'Menu':
        return <Menu />;
      case 'Orders':
        return <div>Orders Content</div>;
      case 'Reports':
        return <div>Reports Content</div>;
      default:
        return <TableOverview tables={tables} addTable={addTable} onSelectTable={handleSelectTable} tableColors={tableColors} />;
    }
  };

  return (
    <div>
      <Navbar activePage={currentPage} onLinkClick={handleLinkClick} />
      <div className="content">
        <SignedIn>{renderPage()}</SignedIn>
        <SignedOut>
          <div className="signin-container">
            <h1>Welcome! Please sign in to access the Admin Dashboard</h1>
            <SignInButton mode="modal" className="clerk-sign-in-button" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export default App;

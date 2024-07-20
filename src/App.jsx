// src/App.js
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TableOverview from './components/TableOverview';
import TableDetails from './components/TableDetails';
import Menu from './components/Menu';
import RestaurantDetails from './components/RestaurantDetails';
import './App.css';
import { SignedIn, SignedOut, SignInButton, useUser, useAuth } from '@clerk/clerk-react';

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
      console.log('Creating/updating user with email:', user.primaryEmailAddress.emailAddress); // Log user email
      const res = await fetch(`${backendApiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          clerkId: user.id,
          isGoogleUser: true, // Indicate Google user
        }),
      });
      const data = await res.json();
      console.log('User created/updated response:', data);
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
  };

  const addTable = () => {
    setTables([...tables, `T${tables.length + 1}`]);
    setTableColors([...tableColors, 'blank']);
  };

  const handleLinkClick = (page) => {
    setCurrentPage(page);
    setSelectedTable(null);
  };

  const handleSelectTable = (tableNumber) => {
    setSelectedTable(tableNumber);
    setCurrentPage('TableDetails');
  };

  const handleBackClick = () => {
    setCurrentPage('TableOverview');
    setSelectedTable(null);
  };

  const updateTableColor = (tableIndex, color) => {
    const updatedColors = [...tableColors];
    updatedColors[tableIndex] = color;
    setTableColors(updatedColors);
  };

  const handleGenerateKOT = () => {
    if (selectedTable) {
      const tableIndex = tables.indexOf(selectedTable);
      updateTableColor(tableIndex, 'running-kot');
    }
  };

  const handleGenerateBill = () => {
    if (selectedTable) {
      const tableIndex = tables.indexOf(selectedTable);
      updateTableColor(tableIndex, 'printed');
    }
  };

  const handleComplete = () => {
    if (selectedTable) {
      const tableIndex = tables.indexOf(selectedTable);
      updateTableColor(tableIndex, 'paid');
      setTimeout(() => {
        updateTableColor(tableIndex, 'blank');
      }, 6000);
    }
  };

  const handleSubmitRestaurantDetails = async (details) => {
    try {
      const token = await getToken(); // Get the token from Clerk
      console.log('Token to be sent:', token); // Log the token being sent
      const res = await fetch(`${backendApiUrl}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify({
          ...details,
          clerkId: user.id, // Use clerkId instead of owner
        }),
      });
      if (!res.ok) {
        const errorDetails = await res.text();
        throw new Error(`Error submitting restaurant details: ${errorDetails}`);
      }
      const data = await res.json();
      console.log('Restaurant Details:', data);
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

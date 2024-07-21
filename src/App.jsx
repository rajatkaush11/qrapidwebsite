import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TableOverview from './components/TableOverview';
import TableDetails from './components/TableDetails';
import Menu from './components/Menu';
import RestaurantDetails from './components/RestaurantDetails';
import LoginPage from './components/LoginPage';
import './App.css';

const App = () => {
  const [tables, setTables] = useState(Array.from({ length: 15 }, (_, index) => `T${index + 1}`));
  const [currentPage, setCurrentPage] = useState('Login');
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableColors, setTableColors] = useState(Array(15).fill('blank'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Restaurant Details:', data);
      setCurrentPage('TableOverview');
    } catch (error) {
      console.error('Error submitting restaurant details:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('RestaurantDetails');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'Login':
          return <LoginPage onLogin={handleLogin} />;
        case 'Register':
          return <RestaurantDetails onSubmit={handleSubmitRestaurantDetails} />;
        default:
          return <LoginPage onLogin={handleLogin} />;
      }
    }

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
        {renderPage()}
      </div>
    </div>
  );
};

export default App;

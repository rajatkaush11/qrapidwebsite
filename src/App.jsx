import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TableOverview from './components/TableOverview';
import TableDetails from './components/TableDetails';
import Menu from './components/Menu';
import ItemList from './components/ItemList';
import RestaurantDetails from './components/RestaurantDetails';
import LoginPage from './components/LoginPage';
import './App.css';

const App = () => {
    const [tables, setTables] = useState(Array.from({ length: 15 }, (_, index) => `T${index + 1}`));
    const [currentPage, setCurrentPage] = useState('Login');
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableColors, setTableColors] = useState(Array(15).fill('blank'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/restaurant`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setRestaurantName(data.name);
                    } else {
                        console.error('Failed to fetch restaurant details');
                    }
                } catch (error) {
                    console.error('Error fetching restaurant details:', error);
                }
            }
        };

        if (isAuthenticated) {
            fetchRestaurantDetails();
        }
    }, [isAuthenticated]);

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

    const handleSubmitRestaurantDetails = () => {
        setCurrentPage('Login');
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentPage('TableOverview');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('Login');
        localStorage.removeItem('token');
    };

    const renderPage = () => {
        if (!isAuthenticated) {
            switch (currentPage) {
                case 'Login':
                    return <LoginPage onLogin={handleLogin} onRegister={() => setCurrentPage('Register')} />;
                case 'Register':
                    return <RestaurantDetails onSubmit={handleSubmitRestaurantDetails} />;
                default:
                    return <LoginPage onLogin={handleLogin} onRegister={() => setCurrentPage('Register')} />;
            }
        }

        switch (currentPage) {
            case 'RestaurantDetails':
                return <RestaurantDetails onSubmit={handleSubmitRestaurantDetails} />;
            case 'TableOverview':
                return (
                    <TableOverview
                        tables={tables}
                        addTable={addTable}
                        onSelectTable={handleSelectTable}
                        tableColors={tableColors}
                        onLogout={handleLogout}
                    />
                );
            case 'TableDetails':
                return <TableDetails tableNumber={selectedTable} onBackClick={handleBackClick} onGenerateKOT={handleGenerateKOT} onGenerateBill={handleGenerateBill} onComplete={handleComplete} />;
            case 'Dashboard':
                return <div>Dashboard Content</div>;
            case 'Menu':
                return <Menu onCategoryClick={handleCategoryClick} />;
            case 'Orders':
                return <div>Orders Content</div>;
            case 'Reports':
                return <div>Reports Content</div>;
            default:
                return <TableOverview tables={tables} addTable={addTable} onSelectTable={handleSelectTable} tableColors={tableColors} />;
        }
    };

    const handleCategoryClick = (categoryId) => {
        setCurrentPage(`/category/${categoryId}/items`);
    };

    return (
        <Router>
            <div>
                {isAuthenticated && currentPage !== 'Login' && currentPage !== 'Register' && (
                    <Navbar activePage={currentPage} onLinkClick={handleLinkClick} />
                )}
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Navigate to={isAuthenticated ? "/table-overview" : "/login"} />} />
                        <Route path="/table-overview" element={renderPage()} />
                        <Route path="/category/:categoryId/items" element={<ItemList />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

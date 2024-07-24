import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    const [orders, setOrders] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setCurrentPage('TableOverview');
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchRestaurantDetails();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const wsUrl = 'wss://customerdb.vercel.app';
        console.log('WebSocket URL:', wsUrl);
        let ws;

        const pingWebSocketServer = async () => {
            try {
                const response = await fetch(wsUrl.replace('wss', 'https').replace('ws', 'http'));
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('WebSocket server is reachable');
                connectWebSocket();
            } catch (error) {
                console.error('WebSocket server is not reachable:', error);
            }
        };

        const connectWebSocket = () => {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('Connected to WebSocket server');
            };

            ws.onmessage = (event) => {
                console.log('WebSocket message received:', event.data);
                const message = JSON.parse(event.data);
                if (message.type === 'NEW_ORDER') {
                    const tableIndex = tables.indexOf(`T${message.order.tableNo}`);
                    if (tableIndex !== -1) {
                        console.log(`New order received for table ${message.order.tableNo}:`, message.order);
                        updateTableColor(tableIndex, 'blue');
                        setOrders((prevOrders) => ({
                            ...prevOrders,
                            [`T${message.order.tableNo}`]: message.order
                        }));
                    }
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('Disconnected from WebSocket server');
                setTimeout(() => {
                    console.log('Reconnecting to WebSocket server...');
                    pingWebSocketServer();
                }, 5000);
            };
        };

        pingWebSocketServer();

        return () => {
            console.log('Closing WebSocket connection');
            if (ws) {
                ws.close();
            }
        };
    }, [tables]);

    const fetchRestaurantDetails = async () => {
        const token = localStorage.getItem('token');
        console.log('Fetched token from localStorage:', token);
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
                    console.log('Fetched restaurant details:', data);
                    setRestaurantName(data.name);
                } else {
                    console.error('Failed to fetch restaurant details');
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        }
    };

    const addTable = () => {
        console.log('Adding a new table');
        setTables([...tables, `T${tables.length + 1}`]);
        setTableColors([...tableColors, 'blank']);
    };

    const handleLinkClick = (page) => {
        console.log('Navigating to page:', page);
        setCurrentPage(page);
        setSelectedTable(null);
    };

    const handleSelectTable = (tableNumber) => {
        console.log('Selected table:', tableNumber);
        setSelectedTable(tableNumber);
        setCurrentPage('TableDetails');
    };

    const handleBackClick = () => {
        console.log('Going back to TableOverview');
        setCurrentPage('TableOverview');
        setSelectedTable(null);
    };

    const updateTableColor = (tableIndex, color) => {
        console.log(`Updating color of table ${tableIndex} to ${color}`);
        const updatedColors = [...tableColors];
        updatedColors[tableIndex] = color;
        setTableColors(updatedColors);
    };

    const handleGenerateKOT = () => {
        if (selectedTable) {
            console.log('Generating KOT for table:', selectedTable);
            const tableIndex = tables.indexOf(selectedTable);
            updateTableColor(tableIndex, 'running-kot');
        }
    };

    const handleGenerateBill = () => {
        if (selectedTable) {
            console.log('Generating bill for table:', selectedTable);
            const tableIndex = tables.indexOf(selectedTable);
            updateTableColor(tableIndex, 'printed');
        }
    };

    const handleComplete = () => {
        if (selectedTable) {
            console.log('Completing order for table:', selectedTable);
            const tableIndex = tables.indexOf(selectedTable);
            updateTableColor(tableIndex, 'paid');
            setTimeout(() => {
                updateTableColor(tableIndex, 'blank');
            }, 6000);
        }
    };

    const handleSubmitRestaurantDetails = () => {
        console.log('Submitting restaurant details');
        setCurrentPage('Login');
    };

    const handleLogin = () => {
        console.log('Login successful');
        setIsAuthenticated(true);
        setCurrentPage('TableOverview');
    };

    const handleLogout = () => {
        console.log('Logging out');
        setIsAuthenticated(false);
        setCurrentPage('Login');
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div>
                {isAuthenticated && currentPage !== 'Login' && currentPage !== 'Register' && (
                    <Navbar activePage={currentPage} onLinkClick={handleLinkClick} />
                )}
                <div className="content">
                    <Routes>
                        <Route path="/" element={
                            !isAuthenticated ? (
                                currentPage === 'Login' ? (
                                    <LoginPage onLogin={handleLogin} onRegister={() => setCurrentPage('Register')} />
                                ) : (
                                    <RestaurantDetails onSubmit={handleSubmitRestaurantDetails} />
                                )
                            ) : (
                                currentPage === 'TableOverview' ? (
                                    <TableOverview
                                        tables={tables}
                                        addTable={addTable}
                                        onSelectTable={handleSelectTable}
                                        tableColors={tableColors}
                                        onLogout={handleLogout}
                                        orders={orders} // Pass orders to TableOverview
                                    />
                                ) : currentPage === 'TableDetails' ? (
                                    <TableDetails
                                        tableNumber={selectedTable}
                                        onBackClick={handleBackClick}
                                        onGenerateKOT={handleGenerateKOT}
                                        onGenerateBill={handleGenerateBill}
                                        onComplete={handleComplete}
                                        orders={orders} // Pass orders to TableDetails
                                    />
                                ) : currentPage === 'Dashboard' ? (
                                    <div>Dashboard Content</div>
                                ) : currentPage === 'Menu' ? (
                                    <Menu />
                                ) : currentPage === 'Orders' ? (
                                    <div>Orders Content</div>
                                ) : currentPage === 'Reports' ? (
                                    <div>Reports Content</div>
                                ) : (
                                    <TableOverview
                                        tables={tables}
                                        addTable={addTable}
                                        onSelectTable={handleSelectTable}
                                        tableColors={tableColors}
                                        orders={orders} // Pass orders to TableOverview
                                    />
                                )
                            )
                        } />
                        <Route path="/category/:categoryId/items" element={<ItemList />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

import React, { useEffect, useState } from 'react';

const TableDetails = ({ tableNumber, onBackClick, onGenerateKOT, onGenerateBill, onComplete }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_CUSTOMER_BACKEND_API}/orders`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Table Details - {tableNumber}</h2>
            <button onClick={onBackClick}>Back to Table Overview</button>
            <button onClick={onGenerateKOT}>Generate KOT</button>
            <button onClick={onGenerateBill}>Generate Bill</button>
            <button onClick={onComplete}>Complete</button>
            <h3>Orders</h3>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>{order.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TableDetails;

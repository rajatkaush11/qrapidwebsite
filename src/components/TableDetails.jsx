import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import './TableDetails.css';

const TableDetails = ({ tableNumber, onBackClick, onGenerateKOT, onGenerateBill, onComplete }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_CUSTOMER_BACKEND_API}/orders?tableNo=${tableNumber.replace('T', '')}`);
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
    }, [tableNumber]);

    return (
        <div className="table-details">
            <div className="back-button-container">
                <button className="back-button" onClick={onBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                </button>
            </div>
            <h2 className="table-title">Table {tableNumber.replace('T', '')}</h2>
            <div className="current-orders">
                <h3>Current Orders</h3>
                {orders.length > 0 ? orders.map(order => (
                    <div key={order._id} className="order-item active">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-text">
                                <span>{item.name} - Qty: {item.quantity}</span>
                                <span>${item.price.toFixed(2)}</span>
                                <button className="delete-button" onClick={() => alert('Delete functionality not implemented')}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                    </div>
                )) : <p>No orders found for this table.</p>}
            </div>
            <div className="actions">
                <button className="action-button add-item" onClick={() => alert('Add item functionality not implemented')}>Add Item</button>
                <button className="action-button generate-kot" onClick={onGenerateKOT}>Generate - KOT</button>
                <button className="action-button generate-bill" onClick={onGenerateBill}>Generate - Bill</button>
                <button className="action-button complete" onClick={onComplete}>Complete</button>
            </div>
        </div>
    );
};

export default TableDetails;

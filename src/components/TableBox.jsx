import React from 'react';
import './TableBox.css';

const TableBox = ({ tableNumber, color, isActive, orders, onClick }) => {
    return (
        <div className={`table-box ${color} ${isActive ? 'active' : ''}`} onClick={() => onClick(tableNumber)}>
            <h3>{tableNumber}</h3>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>{order.name} - Qty: {order.items.reduce((acc, item) => acc + item.quantity, 0)}</li>
                ))}
            </ul>
        </div>
    );
};

export default TableBox;

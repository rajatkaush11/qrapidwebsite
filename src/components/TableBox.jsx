import React from 'react';
import './TableBox.css';

const TableBox = ({ tableNumber, color, isActive, orders, onClick }) => {
    return (
        <div
            className={`table-box ${color} ${isActive ? 'active' : ''}`}
            onClick={() => onClick(tableNumber)}
        >
            {tableNumber}
            {orders.length > 0 && (
                <div className="orders-summary">
                    {orders.map(order => (
                        <div key={order._id}>
                            <p>{order.name} ({order.whatsapp})</p>
                            <ul>
                                {order.items.map(item => (
                                    <li key={item._id}>{item.name} - {item.quantity} x ${item.price}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableBox;

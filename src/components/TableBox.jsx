// components/TableBox.js
import React from 'react';
import './TableBox.css';

const TableBox = ({ tableNumber, color, isActive, onClick, orders }) => {
    return (
        <div
            className={`table-box ${color} ${isActive ? 'active' : ''}`}
            onClick={() => onClick(tableNumber)}
        >
            <div className="table-number">{tableNumber}</div>
            <div className="orders">
                {orders.map((order, index) => (
                    <div key={index} className="order-item">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="item-details">
                                <span>{item.name}</span>
                                <span>{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableBox;

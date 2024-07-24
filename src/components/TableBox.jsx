import React from 'react';
import './TableBox.css';

const TableBox = ({ tableNumber, color, isActive, onClick, orders }) => {
    return (
        <div
            className={`table-box ${color} ${isActive ? 'active' : ''}`}
            onClick={() => onClick(tableNumber)}
        >
            {tableNumber}
            {orders[`T${tableNumber}`] && (
                <div className="order-details">
                    {orders[`T${tableNumber}`].items.map((item, index) => (
                        <div key={index}>{item.name} - {item.quantity}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableBox;

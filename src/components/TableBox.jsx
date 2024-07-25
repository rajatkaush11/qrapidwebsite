import React from 'react';
import './TableBox.css';

const TableBox = ({ tableNumber, color, isActive, orders, onClick }) => {
    return (
        <div className={`table-box ${color} ${isActive ? 'active' : ''}`} onClick={() => onClick(tableNumber)}>
            {tableNumber}
            {/* Display orders summary */}
        </div>
    );
};

export default TableBox;

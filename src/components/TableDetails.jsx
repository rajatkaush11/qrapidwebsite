import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import './TableDetails.css';

const TableDetails = ({ tableNumber, onBackClick, onGenerateKOT, onGenerateBill, onComplete, orders }) => {
    return (
        <div className="table-details">
            <div className="back-button-container">
                <button className="back-button" onClick={onBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                </button>
            </div>
            <h2 className="table-title">Table {tableNumber}</h2>
            <div className="current-orders">
                <h3>Current Orders</h3>
                {orders.map((order, index) => (
                    <div key={index} className="order-item active">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="item-details">
                                <span>{item.name}</span>
                                <span>{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="actions">
                <button className="action-button add-item">Add Item</button>
            </div>
            <div className="action-buttons">
                <button className="action-button generate-kot" onClick={onGenerateKOT}>Generate - KOT</button>
                <button className="action-button generate-bill" onClick={onGenerateBill}>Generate - Bill</button>
                <button className="action-button complete" onClick={onComplete}>Complete</button>
            </div>
        </div>
    );
};

export default TableDetails;

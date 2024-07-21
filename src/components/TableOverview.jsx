import React, { useState } from 'react';
import TableBox from './TableBox';
import './TableOverview.css';

const TableOverview = ({ tables, addTable, onSelectTable, tableColors }) => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [activeRoom, setActiveRoom] = useState('AC Premium');

    const handleTableClick = (tableNumber) => {
        setSelectedTable(tableNumber);
        onSelectTable(tableNumber);
    };

    const handleRoomClick = (room) => {
        setActiveRoom(room);
    };

    return (
        <div className="table-overview">
            <div className="header">
                <h1>QRapid - Table Overview</h1>
                <button className="add-table-btn" onClick={addTable}>+ Add Table</button>
            </div>
            <div className="room-button-group">
                <button
                    className={activeRoom === 'AC Premium' ? 'active' : ''}
                    onClick={() => handleRoomClick('AC Premium')}
                >
                    AC Premium
                </button>
                <button
                    className={activeRoom === 'Room-2' ? 'active' : ''}
                    onClick={() => handleRoomClick('Room-2')}
                >
                    Room-2
                </button>
                <button
                    className={activeRoom === 'Room-3' ? 'active' : ''}
                    onClick={() => handleRoomClick('Room-3')}
                >
                    Room-3
                </button>
            </div>
            <div className="main-container">
                <div className="left-container">
                    <button className="side-button">Running Table</button>
                    <button className="side-button">Printed Table</button>
                    <button className="side-button">Running KOT Table</button>
                </div>
                <div className="table-container">
                    {tables.map((tableNumber, index) => (
                        <TableBox
                            key={index}
                            tableNumber={tableNumber}
                            color={tableColors[index]}
                            isActive={selectedTable === tableNumber}
                            onClick={handleTableClick}
                        />
                    ))}
                </div>
                <div className="status-container">
                    <div className="status-item">
                        <span className="status-color grey"></span> Blank Table
                    </div>
                    <div className="status-item">
                        <span className="status-color blue"></span> Running Table
                    </div>
                    <div className="status-item">
                        <span className="status-color green"></span> Printed Table
                    </div>
                    <div className="status-item">
                        <span className="status-color yellow"></span> Paid Table
                    </div>
                    <div className="status-item">
                        <span className="status-color orange"></span> Running KOT Table
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableOverview;

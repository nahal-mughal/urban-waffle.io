import React, { useState } from "react";
import "./kanban.css";

const initialData = {
  new: [
    { id: 1, text: "Water leakage in apartment 12A" },
    { id: 2, text: "Broken street light near Block C" },
  ],
  inprogress: [{ id: 3, text: "Noise complaint from Block B" }],
  resolved: [],
  canceled: [],
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialData);
  const [dragData, setDragData] = useState(null);
  const [newText, setNewText] = useState("");
  const [newColumn, setNewColumn] = useState("new");

  // Start dragging
  const handleDragStart = (col, card) => {
    setDragData({ col, card });
  };

  // Drop into column
  const handleDrop = (col) => { //col =cancelled
    if (!dragData) return;

    const newCols = { ...columns };

    newCols[dragData.col] = newCols[dragData.col].filter(
      (c) => c.id !== dragData.card.id
    );
    
    newCols[col].push(dragData.card);

    setColumns(newCols);
    setDragData(null);
  };

  // Add complaint
  const addComplaint = () => {
    if (!newText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newText.trim(),
    };

    setColumns({
      ...columns,
      [newColumn]: [...columns[newColumn], newItem],
    });

    setNewText("");
  };

  // Edit complaint
  const editCard = (col, id, newValue) => {
    const updated = { ...columns };
    updated[col] = updated[col].map((card) =>
      card.id === id ? { ...card, text: newValue } : card
    );
    setColumns(updated);
  };

  // Delete
  const deleteCard = (col, id) => {
    const updated = { ...columns };
    updated[col] = updated[col].filter((c) => c.id !== id);
    setColumns(updated);
  };

  const columnTitles = {
    new: "New Complaints",
    inprogress: "In-Progress",
    resolved: "Resolved",
    canceled: "Canceled",
  };

  const columnColors = {
    new: "#2196F3", // Blue
    inprogress: "#FF9800", // Orange
    resolved: "#4CAF50", // Green
    canceled: "#F44336",
  };

  return (
    <div className="kanban-wrapper">
      <h2>Complaint Management Kanban</h2>

      {/* Add Complaint */}
      <div className="add-form">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Complaint description..."
        />
        <select
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
        >
          <option value="new">New</option>
          <option value="inprogress">In-Progress</option>
          <option value="resolved">Resolved</option>
          <option value="canceled">Canceled</option>
        </select>
        <button onClick={addComplaint}>Add</button>
      </div>

      <div className="kanban-container">
        {Object.keys(columns).map((col) => (
          <div
            key={col}
            className="kanban-column"
            style={{ border: `4px solid ${columnColors[col]}` }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col)}
          >
            <h3>{columnTitles[col]}</h3>

            {columns[col].map((card) => (
              <div
                key={card.id}
                className="kanban-card"
                draggable
                onDragStart={() => handleDragStart(col, card)}
              >
                <input
                  className="editable-input"
                  defaultValue={card.text}
                  onBlur={(e) => editCard(col, card.id, e.target.value)}
                />
                <button
                  className="delete-btn"
                  onClick={() => deleteCard(col, card.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

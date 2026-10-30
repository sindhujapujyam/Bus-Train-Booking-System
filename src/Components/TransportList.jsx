
import React from "react";
import "./TransportList.css";

function TransportList({ transports, onBook }) {
  return (
    <div className="transport-container">
      <h2>Available Buses & Trains</h2>

      {transports.length === 0 ? (
        <p className="no-data">
          No transport found. Try another city or travel date.
        </p>
      ) : (
        <div className="transport-list">
          {transports.map((transport) => (
            <div className="transport-card" key={transport.id}>
              <h3>{transport.name}</h3>

              <p><strong>Type:</strong> {transport.type}</p>
              <p>
                <strong>Route:</strong>{" "}
                {transport.source} → {transport.destination}
              </p>
              <p><strong>Date:</strong> {transport.date}</p>
              <p><strong>Departure:</strong> {transport.departure}</p>
              <p><strong>Arrival:</strong> {transport.arrival}</p>
              <p><strong>Available Seats:</strong> {transport.availableSeats}</p>

              <h3 className="transport-price">
                ₹{transport.price}
              </h3>

              <button
                onClick={() => onBook(transport)}
                disabled={Number(transport.availableSeats) <= 0}
              >
                Book Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransportList;

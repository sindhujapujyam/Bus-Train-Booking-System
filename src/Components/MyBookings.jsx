
import React from "react";
import "./MyBookings.css";

function MyBooking({ bookings, onCancel }) {
  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="no-bookings">
          You haven't booked any tickets yet.
        </p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="my-booking-card" key={booking.id}>

              <div className="booking-title">
                <h3>{booking.transportName}</h3>
                <span className={
                  booking.status === "Cancelled"
                    ? "cancelled"
                    : "confirmed"
                }>
                  {booking.status}
                </span>
              </div>

              <p><strong>PNR:</strong> {booking.pnr || booking.id}</p>
              <p><strong>Passenger:</strong> {booking.passengerName}</p>
              <p><strong>Age:</strong> {booking.age}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Transport:</strong> {booking.type}</p>
              <p>
                <strong>Journey:</strong>{" "}
                {booking.source} → {booking.destination}
              </p>
              <p><strong>Date:</strong> {booking.date}</p>

              <h3 className="booking-price">
                ₹{booking.price}
              </h3>

              {booking.status !== "Cancelled" && (
                <button
                  className="cancel-booking-btn"
                  onClick={() => onCancel(booking)}
                >
                  Cancel Ticket
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBooking;

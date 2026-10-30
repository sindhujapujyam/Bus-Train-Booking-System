
import React from "react";
import MyBooking from "../components/MyBookings";

function Bookings({ bookings, onCancel }) {
  return (
    <MyBooking
      bookings={bookings}
      onCancel={onCancel}
    />
  );
}

export default Bookings;

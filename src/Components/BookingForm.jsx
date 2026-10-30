
import React, { useState } from "react";
import "./BookingForm.css";

function BookingForm({ transport, onConfirm, onClose }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(age) < 1 || Number(age) > 120) {
      alert("Please enter a valid age");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      await onConfirm({
        name: name.trim(),
        age: Number(age),
        gender,
        phone,
        transportId: transport.id
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-overlay">
      <div className="booking-form">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <h2>Passenger Details</h2>

        <div className="booking-summary">
          <h3>{transport.name}</h3>
          <p>
            {transport.source} → {transport.destination}
          </p>
          <p>Journey Date: {transport.date}</p>
          <strong>Ticket Price: ₹{transport.price}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Passenger Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            required
            maxLength={80}
          />

          <label>Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Mobile Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            maxLength={10}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;


import React, { useState } from "react";
import "./SearchForm.css";

const cities = [
  "Amaravati", "Vijayawada", "Visakhapatnam",
  "Guntur", "Tirupati", "Kurnool", "Nellore",
  "Rajahmundry", "Kakinada", "Eluru", "Ongole",
  "Srikakulam", "Vizianagaram", "Anantapur",
  "Kadapa", "Chittoor", "Machilipatnam", "Tenali",
  "Bhimavaram", "Tadepalligudem", "Nandyal",
  "Proddatur", "Hindupur", "Adoni", "Madanapalle",
  "Anakapalli", "Amalapuram", "Bapatla",
  "Narasaraopet", "Parvathipuram", "Markapuram",
  "Puttaparthi", "Araku Valley", "Srisailam",
  "Horsley Hills", "Gandikota", "Paderu",
  "Hyderabad", "Bangalore", "Chennai"
];

function SearchForm({ onSearch }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("All");

  const today = new Date().toLocaleDateString("en-CA");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!source || !destination || !date) {
      alert("Please fill all fields!");
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      alert("Source and destination cannot be same!");
      return;
    }

    onSearch({
      source: source.trim(),
      destination: destination.trim(),
      date,
      type
    });
  };

  return (
    <div className="search-container">
      <div className="search-heading">
        <h2>Find Your Journey</h2>
        <p>Book your Bus and Train tickets easily</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From City</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          >
            <option value="">Select Source City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>To City</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="">Select Destination City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Travel Date</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Transport Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="All">All Transports</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
          </select>
        </div>

        <button type="submit" className="search-btn">
          Search Buses & Trains
        </button>
      </form>

      <div className="search-info">
        <p>Explore Andhra Pradesh and other major cities.</p>
        <p>Choose your journey and find available transport services.</p>
      </div>
    </div>
  );
}

export default SearchForm;

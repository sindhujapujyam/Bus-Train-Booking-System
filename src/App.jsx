
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";

import "./App.css";

const API = "http://localhost:5000";

// Normalize city names
const normalize = (value) =>
  String(value || "").trim().toLowerCase();

// Generate stable sample transport ID
const createDemoId = (source, destination, date, type) => {
  return (
    "demo-" +
    (source + destination + date + type)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
  );
};

// Generate sample transport details
const generateSampleTransports = (
  source,
  destination,
  date,
  type
) => {
  const busNames = [
    "Orange Express",
    "Green Line Travels",
    "Royal Travels",
    "Super Luxury Bus",
    "Night Rider",
    "AP Travels",
    "Sree Krishna Travels"
  ];

  const trainNames = [
    "AP Express",
    "Intercity Express",
    "Coastal Express",
    "Superfast Express",
    "City Express",
    "Andhra Passenger"
  ];

  const hash = [...(source + destination + date)]
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const busDepartureHour = 6 + (hash % 15);
  const trainDepartureHour = 6 + ((hash + 4) % 15);

  const formatTime = (hour, minute = 0) =>
    `${String(hour % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  const busArrivalHour = (busDepartureHour + 7) % 24;
  const trainArrivalHour = (trainDepartureHour + 5) % 24;

  const bus = {
    id: createDemoId(source, destination, date, "Bus"),
    name: busNames[hash % busNames.length],
    type: "Bus",
    routeId: "DEMO",
    source,
    destination,
    departure: formatTime(busDepartureHour),
    arrival: formatTime(busArrivalHour),
    date,
    price: 500 + (hash % 10) * 100,
    totalSeats: 40,
    availableSeats: 40,
    demo: true
  };

  const train = {
    id: createDemoId(source, destination, date, "Train"),
    name: trainNames[hash % trainNames.length],
    type: "Train",
    routeId: "DEMO",
    source,
    destination,
    departure: formatTime(trainDepartureHour, 30),
    arrival: formatTime(trainArrivalHour, 30),
    date,
    price: 300 + (hash % 8) * 100,
    totalSeats: 60,
    availableSeats: 60,
    demo: true
  };

  const generated = [bus, train];

  if (type && type !== "All") {
    return generated.filter(
      (transport) => transport.type === type
    );
  }

  return generated;
};

function App() {
  const [transports, setTransports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transports and bookings
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [transportResponse, bookingResponse] =
        await Promise.all([
          fetch(`${API}/transports`),
          fetch(`${API}/bookings`)
        ]);

      if (!transportResponse.ok || !bookingResponse.ok) {
        throw new Error("Cannot connect to JSON Server");
      }

      const transportData = await transportResponse.json();
      const bookingData = await bookingResponse.json();

      setTransports(transportData);
      setFilteredTransports(transportData);
      setBookings(bookingData);

    } catch (err) {
      console.error(err);
      setError(
        "JSON Server is not running. Please start JSON Server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search transports
  const handleSearch = ({
    source,
    destination,
    date,
    type
  }) => {
    const results = transports.filter((transport) => {
      const sourceMatch =
        normalize(transport.source) === normalize(source);

      const destinationMatch =
        normalize(transport.destination) === normalize(destination);

      const dateMatch =
        String(transport.date || "").slice(0, 10) ===
        String(date || "").slice(0, 10);

      const typeMatch =
        type === "All" ||
        normalize(transport.type) === normalize(type);

      const seatsMatch =
        Number(transport.availableSeats) > 0;

      return (
        sourceMatch &&
        destinationMatch &&
        dateMatch &&
        typeMatch &&
        seatsMatch
      );
    });

    let finalResults = results;

    // Generate sample transports if no matching record exists
    if (finalResults.length === 0) {
      finalResults = generateSampleTransports(
        source.trim(),
        destination.trim(),
        date,
        type
      );
    }

    console.log("Search Details:", {
      source,
      destination,
      date,
      type
    });

    console.log("Search Results:", finalResults);

    setFilteredTransports(finalResults);
  };

  // Select transport for booking
  const handleBook = (transport) => {
    setSelectedTransport(transport);
  };

  // Confirm booking
  const handleConfirmBooking = async (passenger) => {
    try {
      let transport;

      // Check whether transport already exists in JSON Server
      const response = await fetch(
        `${API}/transports/${passenger.transportId}`
      );

      if (response.ok) {
        transport = await response.json();
      } else if (
        selectedTransport &&
        String(selectedTransport.id) ===
          String(passenger.transportId)
      ) {
        // Save generated sample transport in JSON Server
        const { id, demo, ...transportToSave } =
          selectedTransport;

        const saveResponse = await fetch(
          `${API}/transports`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(transportToSave)
          }
        );

        if (!saveResponse.ok) {
          throw new Error("Sample transport creation failed");
        }

        transport = await saveResponse.json();

      } else {
        throw new Error("Transport not found");
      }

      if (Number(transport.availableSeats) <= 0) {
        alert("Sorry! No seats available.");
        await fetchData();
        return;
      }

      // Save passenger with actual transport ID
      const passengerData = {
        ...passenger,
        transportId: transport.id
      };

      const passengerResponse = await fetch(
        `${API}/passengers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(passengerData)
        }
      );

      if (!passengerResponse.ok) {
        throw new Error("Passenger creation failed");
      }

      const savedPassenger =
        await passengerResponse.json();

      // Reduce available seats
      const seatResponse = await fetch(
        `${API}/transports/${transport.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            availableSeats:
              Number(transport.availableSeats) - 1
          })
        }
      );

      if (!seatResponse.ok) {
        throw new Error("Seat update failed");
      }

      // Create booking record
      const bookingData = {
        pnr: "BT" + Date.now(),
        passengerId: savedPassenger.id,
        passengerName: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        phone: passenger.phone,

        transportId: transport.id,
        transportName: transport.name,
        type: transport.type,

        source: transport.source,
        destination: transport.destination,

        departure: transport.departure,
        arrival: transport.arrival,

        date: transport.date,
        price: transport.price,

        status: "Confirmed",
        demo: Boolean(selectedTransport?.demo)
      };

      const bookingResponse = await fetch(
        `${API}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingData)
        }
      );

      if (!bookingResponse.ok) {
        throw new Error("Booking creation failed");
      }

      alert("Sample ticket booked successfully!");

      setSelectedTransport(null);

      await fetchData();

    } catch (err) {
      console.error(err);
      alert("Booking failed: " + err.message);
      await fetchData();
    }
  };

  // Cancel booking
  const handleCancelBooking = async (booking) => {
    if (booking.status === "Cancelled") {
      return;
    }

    if (!window.confirm("Do you want to cancel this ticket?")) {
      return;
    }

    try {
      const transportResponse = await fetch(
        `${API}/transports/${booking.transportId}`
      );

      if (!transportResponse.ok) {
        throw new Error("Transport not found");
      }

      const transport = await transportResponse.json();

      // Restore available seat
      const seatResponse = await fetch(
        `${API}/transports/${transport.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            availableSeats: Math.min(
              Number(transport.totalSeats),
              Number(transport.availableSeats) + 1
            )
          })
        }
      );

      if (!seatResponse.ok) {
        throw new Error("Seat update failed");
      }

      // Update booking status
      const cancelResponse = await fetch(
        `${API}/bookings/${booking.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "Cancelled"
          })
        }
      );

      if (!cancelResponse.ok) {
        throw new Error("Cancellation failed");
      }

      alert("Ticket cancelled successfully!");

      await fetchData();

    } catch (err) {
      console.error(err);
      alert("Cancellation failed. Please try again.");
      await fetchData();
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="loading-message">
        Loading transports...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="error-message">
        <h3>{error}</h3>
        <button onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              transports={filteredTransports}
              onSearch={handleSearch}
              onBook={handleBook}
              selectedTransport={selectedTransport}
              onConfirmBooking={handleConfirmBooking}
              onCloseBooking={() =>
                setSelectedTransport(null)
              }
            />
          }
        />

        <Route
          path="/bookings"
          element={
            <Bookings
              bookings={bookings}
              onCancel={handleCancelBooking}
            />
          }
        />

        <Route
          path="*"
          element={
            <div className="not-found">
              <h2>Page Not Found</h2>
              <a href="/">Go to Home</a>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;

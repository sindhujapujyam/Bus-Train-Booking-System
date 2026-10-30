
import React from "react";
import SearchForm from "../components/SearchForm";
import TransportList from "../components/TransportList";
import BookingForm from "../components/BookingForm";

function Home({
  transports,
  onSearch,
  onBook,
  selectedTransport,
  onConfirmBooking,
  onCloseBooking
}) {
  return (
    <>
      <section className="hero-section">
        <h1>Bus & Train Ticket Reservation</h1>
        <p>Travel anywhere with comfort and convenience.</p>
      </section>

      <SearchForm onSearch={onSearch} />

      <TransportList
        transports={transports}
        onBook={onBook}
      />

      {selectedTransport && (
        <BookingForm
          transport={selectedTransport}
          onConfirm={onConfirmBooking}
          onClose={onCloseBooking}
        />
      )}

      <footer className="footer">
        <p>Bus & Train Reservation Portal</p>
        <p>© 2026 All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default Home;

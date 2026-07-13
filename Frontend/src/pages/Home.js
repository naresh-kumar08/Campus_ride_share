import React, { useState } from "react";
import { Link } from "react-router-dom";
import RideSearch from "../components/RideSearch";
import RideCard from "../components/RideCard";
import RideDetailsModal from "../components/RideDetailsModal";
import useRides from "../hooks/useRides";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { rides, refresh, setFilters } = useRides();
  const [selectedRide, setSelectedRide] = useState(null);
  const [booking, setBooking] = useState(false);
  const { isAuthenticated } = useAuth();

  const searchRides = (filters) => {
    setFilters(filters);
    refresh(filters);
  };

  const confirmRide = async (bookingMessage) => {
    if (!selectedRide) return;
    setBooking(true);
    try {
      const response = await api.post("/api/bookings/confirm", {
        rideId: selectedRide._id,
        bookingMessage: bookingMessage?.trim() || undefined,
      });
      // alert(
      //   response.data?.message || "Ride booking request sent! Waiting for rider confirmation.\nCampus Helpline: +91-800-000-0000"
      // );
      setSelectedRide(null);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to send ride request");
    } finally {
      setBooking(false);
    }
  };

  const primaryCta = isAuthenticated ? "/dashboard" : "/register";
  const secondaryCta = isAuthenticated ? "/previous-rides" : "/login";

  const primaryLabel = isAuthenticated ? "Dashboard" : "Create Account";
  const secondaryLabel = isAuthenticated ? "Your Ride History" : "Login to Continue";

  return (
    <main className="container grid home-page">
      {/* HERO SECTION */}
      <section className="card page-hero">
        <div>
          <p className="eyebrow">Verified Campus Rides</p>
          <h1 className="hero-title">Campus Ride Share</h1>

          <p className="hero-subtitle">
           Connect, travel together, and reduce commuting costs while promoting sustainability on campus.  Find verified, affordable and safe rides shared with fellow students.
          </p>

          <div className="hero-actions">
            <Link className="btn" to={primaryCta}>
              {primaryLabel}
            </Link>
            <Link className="btn secondary" to={secondaryCta}>
              {secondaryLabel}
            </Link>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <small>Active Rides</small>
              <strong>{rides.length}</strong>
              <span>Show real time rides</span>
            </article>
            <article className="stat-card">
              <small>Fare guideline</small>
              <strong>₹5/km</strong>
              <span>Affordable Prices</span>
            </article>
          </div>
        </div>

        <div className="card supporting-panel">
          <p className="eyebrow">Why students trust us</p>
          <h3>Ride Together, Save Money, Stay Safe</h3>
          <ul className="list-clean">
            {/* <li>Ride Together, Save Money, Stay Safe</li> */}
            <li>College-email verification for every account</li>
            <li>Real-time seat availability and trip updates</li>
            <li>Ratings & reviews after each completed ride</li>
            <li>24*7 Help and Support</li>
          </ul>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <RideSearch onSearch={searchRides} />

      {/* AVAILABLE RIDES SECTION */}
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Previous Rides</p>
            <h2>Available Rides</h2>
          </div>
          <span className="badge">{rides.length || 0} open</span>
        </div>

        <div className="rides-grid">
          {rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onSelect={(r) => {
                if (!isAuthenticated) {
                  alert("Please login to book a ride.");
                  return;
                }
                setSelectedRide(r);
              }}
            />
          ))}
        </div>

        {!rides.length && (
          <div className="empty-state">
            No active rides right now. Try adjusting your filters or check again soon.
          </div>
        )}
      </section>

      {/* RIDE DETAILS MODAL */}
      <RideDetailsModal
        ride={selectedRide}
        isBooking={booking}
        onConfirm={confirmRide}
        onClose={() => setSelectedRide(null)}
      />
    </main>
  );
};

export default Home;

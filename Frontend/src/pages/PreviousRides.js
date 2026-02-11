import React, { useEffect, useState } from "react";
import api from "../api";
import RatingModal from "../components/RatingModal";

const toneClass = (message) => {
  if (!message) return "";
  if (/success|updated|sent/i.test(message)) return "success";
  if (/unable|error|please|fail/i.test(message)) return "error";
  return "";
};

const PreviousRides = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingTarget, setRatingTarget] = useState(null);
  const [ratingError, setRatingError] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [complaintDrafts, setComplaintDrafts] = useState({});
  const [complaintStatus, setComplaintStatus] = useState({});
  const [complaintSubmitting, setComplaintSubmitting] = useState({});
  const [confirmingBooking, setConfirmingBooking] = useState("");
  const [rejectingBooking, setRejectingBooking] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bookings");
      const visible = (data.data || []).filter(
        (booking) => booking.status !== "cancelled"
      );
      setBookings(visible);
      return visible;
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load previous rides";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const markCompleted = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/complete`);
      const refreshed = await fetchBookings();
      const updated = refreshed.find((booking) => booking._id === bookingId);
      if (updated?.canRate && !updated.hasRated) {
        setRatingTarget(updated);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to mark ride as completed");
    }
  };

  const toggleComplaint = (bookingId) => {
    setExpandedComplaint((prev) => (prev === bookingId ? null : bookingId));
    setComplaintStatus((prev) => ({ ...prev, [bookingId]: "" }));
  };

  const handleComplaintChange = (bookingId, value) => {
    setComplaintDrafts((prev) => ({ ...prev, [bookingId]: value }));
  };

  const submitComplaint = async (booking) => {
    const bookingId = booking._id;
    const message = (complaintDrafts[bookingId] || "").trim();
    if (!message) {
      setComplaintStatus((prev) => ({ ...prev, [bookingId]: "Please add your complaint details." }));
      return;
    }

    setComplaintSubmitting((prev) => ({ ...prev, [bookingId]: true }));
    setComplaintStatus((prev) => ({ ...prev, [bookingId]: "" }));
    try {
      await api.post("/complaints/add", {
        rideId: booking.rideId?._id || booking.rideId,
        message,
      });
      setComplaintStatus((prev) => ({
        ...prev,
        [bookingId]: "Complaint submitted successfully",
      }));
      setComplaintDrafts((prev) => ({ ...prev, [bookingId]: "" }));
      setExpandedComplaint(null);
    } catch (err) {
      setComplaintStatus((prev) => ({
        ...prev,
        [bookingId]: err.response?.data?.message || "Unable to submit complaint",
      }));
    } finally {
      setComplaintSubmitting((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const openRating = (booking) => {
    if (!booking?.canRate || booking.hasRated) return;
    setRatingError("");
    setRatingTarget(booking);
  };

  const submitRating = async ({ stars, review }) => {
    if (!ratingTarget) return;
    setRatingSubmitting(true);
    setRatingError("");
    try {
      await api.post("/rating/add", {
        rideId: ratingTarget.rideId?._id || ratingTarget.rideId,
        toUserId: ratingTarget.counterparty?._id,
        stars,
        review,
      });
      await fetchBookings();
      setRatingTarget(null);
    } catch (err) {
      setRatingError(err.response?.data?.message || "Unable to submit rating");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleRiderConfirm = async (bookingId) => {
    if (!window.confirm("Confirm this booking? Other pending requests for this ride will be cancelled.")) {
      return;
    }
    setConfirmingBooking(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/rider-confirm`);
      alert("Booking confirmed successfully!");
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to confirm booking");
    } finally {
      setConfirmingBooking("");
    }
  };

  const handleRiderReject = async (bookingId) => {
    if (!window.confirm("Reject this booking request?")) {
      return;
    }
    setRejectingBooking(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/rider-reject`);
      alert("Booking request rejected");
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to reject booking");
    } finally {
      setRejectingBooking("");
    }
  };

  return (
    <main className="container grid home-page">
      <section className="card">
        <p className="eyebrow">history</p>
        <h1 className="page-title">Your Previous Rides</h1>
        <p className="section-subtitle">
          Check your ride completion status, rate your rides, register your complaints and relive the context of every journey.
        </p>
      </section>

      {error && <div className="card text-error">{error}</div>}
      {loading && <div className="card">Loading rides...</div>}
      {!loading && !bookings.length && <div className="card empty-state">No rides yet.</div>}

      {bookings.map((booking) => (
        <article key={booking._id} className="card history-card">
          <div className="history-card__header">
            <div className="stack">
              <h3>
                {booking.rideId?.from} → {booking.rideId?.to}
              </h3>
              <p className="ride-card__meta">
                <span>
                  {booking.rideId?.date} · {booking.rideId?.time}
                </span>
                <span className={`status-pill ${
                  booking.status === "completed" ? "success" : 
                  booking.status === "confirmed" ? "info" : 
                  booking.status === "pending" ? "warning" : 
                  "error"
                }`}>
                  {booking.status}
                </span>
              </p>
              <p className="section-subtitle">
                Role: {booking.role === "rider" ? "You were the rider" : "You were the passenger"}
              </p>
              {booking.counterparty?.name && (
                <p className="section-subtitle">
                  Counterparty: {booking.counterparty.name}
                  {booking.counterparty.rating !== undefined && ` • Rating ${booking.counterparty.rating}/5`}
                </p>
              )}
              {booking.role === "rider" && booking.bookingMessage && (
                <p className="section-subtitle">
                  <strong>Passenger instructions:</strong> {booking.bookingMessage}
                </p>
              )}
            </div>
            <div className="history-actions">
              {/* Rider actions for pending bookings */}
              {booking.role === "rider" && booking.status === "pending" && (
                <>
                  <button 
                    className="btn" 
                    onClick={() => handleRiderConfirm(booking._id)}
                    disabled={confirmingBooking === booking._id || rejectingBooking === booking._id}
                  >
                    {confirmingBooking === booking._id ? "Confirming..." : "Confirm"}
                  </button>
                  <button 
                    className="btn secondary" 
                    onClick={() => handleRiderReject(booking._id)}
                    disabled={confirmingBooking === booking._id || rejectingBooking === booking._id}
                  >
                    {rejectingBooking === booking._id ? "Rejecting..." : "Reject"}
                  </button>
                </>
              )}
              {/* Standard actions */}
              {booking.status !== "completed" && booking.status !== "pending" && (
                <button className="btn" onClick={() => markCompleted(booking._id)}>
                  Mark completed
                </button>
              )}
              {booking.canRate && !booking.hasRated && (
                <button className="btn secondary" onClick={() => openRating(booking)}>
                  Rate ride
                </button>
              )}
              {booking.status === "completed" && (
                <button className="btn secondary" onClick={() => toggleComplaint(booking._id)}>
                  {expandedComplaint === booking._id ? "Close complaint" : "Add complaint"}
                </button>
              )}
            </div>
          </div>

          {expandedComplaint === booking._id && (
            <div className="complaint-panel stack">
              <textarea
                rows={3}
                value={complaintDrafts[booking._id] || ""}
                placeholder="Describe your complaint"
                onChange={(e) => handleComplaintChange(booking._id, e.target.value)}
              />
              <button className="btn" onClick={() => submitComplaint(booking)} disabled={complaintSubmitting[booking._id]}>
                {complaintSubmitting[booking._id] ? "Submitting..." : "Submit complaint"}
              </button>
              {complaintStatus[booking._id] && (
                <small className={`status-note ${toneClass(complaintStatus[booking._id])}`}>
                  {complaintStatus[booking._id]}
                </small>
              )}
            </div>
          )}
        </article>
      ))}

      <RatingModal
        booking={ratingTarget}
        isSubmitting={ratingSubmitting}
        error={ratingError}
        onSubmit={submitRating}
        onClose={() => setRatingTarget(null)}
      />
    </main>
  );
};

export default PreviousRides;

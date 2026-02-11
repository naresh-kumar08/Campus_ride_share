import React, { useState } from "react";
import api from "../api";

const initialState = {
  from: "",
  to: "",
  distance: "",
  date: "",
  time: "",
  seats: 1,
  riderContact: "",
};

const AddRideModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/rides", { ...form, distance: Number(form.distance) });
      setForm(initialState);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add ride");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <p className="eyebrow">Rider console</p>
        <h2>Book a Ride</h2>
        <p className="section-subtitle">Transparent fares auto-calculate at ₹5/km. Students see only future rides.</p>

        <form className="grid" onSubmit={handleSubmit}>
          <div className="search-grid">
            <label>
              From
              <input name="from" value={form.from} onChange={handleChange} required />
            </label>
            <label>
              To
              <input name="to" value={form.to} onChange={handleChange} required />
            </label>
            <label>
              Distance (km)
              <input type="number" name="distance" value={form.distance} onChange={handleChange} required />
            </label>
            <label>
              Date
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>
              Time (AM/PM)
              <input name="time" value={form.time} onChange={handleChange} placeholder="07:30 PM" required />
            </label>
            <label>
              Seats
              <input type="number" name="seats" min="1" value={form.seats} onChange={handleChange} />
            </label>
            <label>
                Rider's Contact
              <input name="riderContact" value={form.riderContact} onChange={handleChange} />
            </label>
          </div>

          <div className="split-panel">
            <div className="stat-card">
              <small>Auto-calculated Fare</small>
              <strong>₹{Number(form.distance || 0) * 5}</strong>
              <span>₹5 per km • Capped for campus safety</span>
            </div>
            {error && <small className="text-error">{error}</small>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" disabled={submitting}>
              {submitting ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRideModal;



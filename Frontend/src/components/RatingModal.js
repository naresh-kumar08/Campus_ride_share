import React, { useEffect, useState } from "react";

const RatingModal = ({ booking, isSubmitting, error, onSubmit, onClose }) => {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    setStars(5);
    setReview("");
  }, [booking]);

  if (!booking) return null;

  const counterpartName = booking.counterparty?.name || "the user";

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({ stars, review });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <p className="eyebrow">Feedback loop</p>
        <h3>Rate {counterpartName}</h3>
        <form className="grid" onSubmit={handleSubmit}>
          <label>
            Stars
            <select value={stars} onChange={(e) => setStars(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            Review (optional)
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience"
            />
          </label>
          {error && <p className="text-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;




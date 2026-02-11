// import React from "react";
// import { Link } from "react-router-dom";

// const formatRating = (rating) => {
//   if (rating === undefined || rating === null) return "New";
//   return `${Number(rating).toFixed(1)}/5`;
// };

// const RideCard = ({ ride, onSelect, onDelete, currentUser, isDeleting, showBooking = true }) => {
//   const riderIdValue = typeof ride.riderId === "string" ? ride.riderId : ride.riderId?._id;
//   const canManage = currentUser?.role === "admin" || currentUser?.id === riderIdValue;
//   const showRating = ride.riderId?.rating !== undefined;
//   const isRider = currentUser?.role === "rider";
//   const statusLabel = ride.status ? ride.status.replace(/_/g, " ") : "";

//   return (
//     <article className="card ride-card">
//       <div className="ride-card__header">
//         <div>
//           <p className="eyebrow">Route</p>
//           <p className="ride-card__destination">
//             {ride.from} → {ride.to}
//           </p>
//           <div className="ride-card__meta">
//             <span>
//               {ride.date} • {ride.time}
//             </span>
//             {ride.distance && <span>{ride.distance} km</span>}
//             {ride.seats && <span>{ride.seats} seats</span>}
//           </div>
//         </div>
//         <div className="badge">₹{ride.fare}</div>
//       </div>

//       <div className="ride-card__secondary">
//         <span>
//           Rider: <strong>{ride.riderId?.name}</strong> ({ride.riderId?.gender || "NA"})
//         </span>
//         {showRating && <span>Rating {formatRating(ride.riderId.rating)}</span>}
//         {ride.riderContact && <span>Contact {ride.riderContact}</span>}
//       </div>

//       {ride.status && (
//         <div className="ride-card__secondary">
//           <span className={`status-pill ${ride.status === "completed" ? "success" : "warning"}`}>{statusLabel}</span>
//         </div>
//       )}

//       <div className="ride-card__actions">
//         <Link className="btn secondary" to={`/ride/${ride._id}`}>
//           Details
//         </Link>
//         {showBooking && !isRider && (
//           <button className="btn" onClick={() => onSelect?.(ride)}>
//             Book
//           </button>
//         )}
//         {canManage && (
//           <button className="btn destructive" onClick={() => onDelete?.(ride)} disabled={isDeleting}>
//             {isDeleting ? "Deleting..." : "Delete"}
//           </button>
//         )}
//       </div>
//     </article>
//   );
// };

// export default RideCard;

import React from "react";
import { Link } from "react-router-dom";

const formatRating = (rating) => {
  if (rating === undefined || rating === null) return "New";
  return `${Number(rating).toFixed(1)}/5`;
};

const RideCard = ({
  ride,
  onSelect,
  onDelete,
  currentUser,
  isDeleting,
  showBooking = true,
}) => {
  const riderIdValue =
    typeof ride.riderId === "string" ? ride.riderId : ride.riderId?._id;

  const canManage =
    (currentUser?.role === "admin" || currentUser?.id === riderIdValue);

  const showRating = ride.riderId?.rating !== undefined;
  const isRider = currentUser?.role === "rider";

  // 🟢 Hide delete when ride is confirmed/booked/completed
  const cannotDeleteStatuses = ["confirmed", "booked", "completed"];
  const deleteAllowed = canManage && !cannotDeleteStatuses.includes(ride.status);

  const statusLabel = ride.status ? ride.status.replace(/_/g, " ") : "";

  return (
    <article className="card ride-card">
      <div className="ride-card__header">
        <div>
          <p className="eyebrow">Route</p>
          <p className="ride-card__destination">
            {ride.from} → {ride.to}
          </p>

          <div className="ride-card__meta">
            <span>
              {ride.date} • {ride.time}
            </span>
            {ride.distance && <span>{ride.distance} km</span>}
            {ride.seats && <span>{ride.seats} seats</span>}
          </div>
        </div>

        <div className="badge">₹{ride.fare}</div>
      </div>

      <div className="ride-card__secondary">
        <span>
          Rider: <strong>{ride.riderId?.name}</strong>(
          {ride.riderId?.gender || "NA"})
        </span>

        {showRating && (
          <span>Rating {formatRating(ride.riderId.rating)}</span>
        )}

        {ride.riderContact && (
          <span>Contact {ride.riderContact}</span>
        )}
      </div>

      {ride.status && (
        <div className="ride-card__secondary">
          <span
            className={`status-pill ${
              ride.status === "completed"
                ? "success"
                : ride.status === "confirmed" || ride.status === "booked"
                ? "info"
                : "warning"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      )}

      <div className="ride-card__actions">
        <Link className="btn secondary" to={`/ride/${ride._id}`}>
          Details
        </Link>

        {/* Booking Button */}
        {showBooking &&
          !isRider &&
          !["confirmed", "booked", "completed"].includes(ride.status) && (
          <button className="btn" onClick={() => onSelect?.(ride)}>
            Book
          </button>
        )}

        {/* DELETE BUTTON — HIDDEN IF RIDE CONFIRMED */}
        {deleteAllowed && (
          <button
            className="btn destructive"
            onClick={() => onDelete?.(ride)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </article>
  );
};

export default RideCard;


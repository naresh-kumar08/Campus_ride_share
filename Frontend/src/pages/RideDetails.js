import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const RideDetails = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/rides/${id}`);
      setRide(data.data);
    };
    load();
  }, [id]);

  if (!ride) return <main className="container card">Loading...</main>;

  const riderProfile = typeof ride.riderId === "object" ? ride.riderId : {};

  return (
    <main className="container grid home-page">
      <section className="card">
        <p className="eyebrow">Ride detail</p>
        <h1 className="page-title">
          {ride.from} → {ride.to}
        </h1>
        <p className="ride-card__meta">
          <span>
            {ride.date} · {ride.time}
          </span>
          <span>{ride.distance} km</span>
          <span>₹{ride.fare}</span>
        </p>

        <div className="stats-grid">
          <article className="stat-card">
            <small>Rider</small>
            <strong className="stat-value-sm">{riderProfile.name || "NA"}</strong>
            <span>{riderProfile.gender || "—"}</span>
          </article>
          <article className="stat-card">
            <small>Rating</small>
            <strong>{riderProfile.rating ? Number(riderProfile.rating).toFixed(1) : "New"}</strong>
            {/* <span>Community verified</span> */}
          </article>
          <article className="stat-card">
            <small>Contact</small>
            <strong className="stat-value-sm">{ride.riderContact || riderProfile.phone || "NA"}</strong>
            {/* <span>Share once booked</span> */}
          </article>
        </div>
      </section>

      <section className="card supporting-panel">
        <p className="eyebrow">Need something?</p>
        <p className="section-subtitle">
          You can Register your Complaints from the previous ride section.
          Admins review every escalation with full context.
        </p><br />
        <strong>Helpline: +91-800-000-0000</strong>
      </section>
    </main>
  );
};

export default RideDetails;


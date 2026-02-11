import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const { data } = await api.get(`/rating/${user.id}`);
      setRatings(data.data);
    };
    load();
  }, [user]);

  if (!user) return null;

  return (
    <main className="container grid home-page">
      <section className="card">
        <p className="eyebrow">Profile</p>
        <h1 className="page-title">{user.name}</h1>
        <p className="section-subtitle">Role: {user.role}</p>

        <div className="stats-grid">
          <article className="stat-card">
            <small>Completed Rides</small>
            <strong>{user.ridesCompleted || 0}</strong>
            {/* <span>Total journeys</span> */}
          </article>
          <article className="stat-card">
            <small>Verified User Email :-</small>
            <strong className="stat-value-sm">{user.email}</strong>
            <span></span>
          </article>
          <article className="stat-card">
            <small>Contact</small>
            <strong className="stat-value-sm">{user.phone || "NA"}</strong>
            {/* <span>Private to riders you book</span> */}
          </article>
        </div>
      </section>

      {ratings && (
        <section className="card" id="ratings">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ratings</p>
              <h2>
                {ratings.average}/5 · {ratings.total} reviews
              </h2>
            </div>
          </div>
          <div className="rating-list">
            {ratings.reviews.map((review) => (
              <article key={review._id} className="rating-item">
                <strong>
                  {review.stars}★ · {review.byUser?.name || "Anonymous"}
                </strong>
                <p>{review.review}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Profile;


import React from "react";
import AddRideModal from "../components/AddRideModal";
import useModal from "../hooks/useModal";

const AddRidePage = () => {
  const modal = useModal(true);

  return (
    <main className="container grid home-page">
      <section className="card">
        <p className="eyebrow">Rider operations</p>
        <h1 className="page-title">Publish a campus ride</h1>
        <p className="section-subtitle">
          Fares auto-calculate at ₹5/km with dynamic cards showcasing your slots. Students can only view future rides
          ensuring capacity is protected.
        </p>
        <div className="hero-actions">
          <button className="btn" onClick={modal.open}>
            Launch form
          </button>
          <button className="btn secondary" onClick={modal.open}>
            Quick add
          </button>
        </div>
      </section>

      <section className="insights-grid">
        <article className="insight-card">
          <p className="eyebrow">Automation</p>
          <h3>Fare intelligence</h3>
          <p>Distance x ₹5 ensures parity across riders. No math, no disputes.</p>
        </article>
        <article className="insight-card">
          <p className="eyebrow">Compliance</p>
          <h3>Helpline logging</h3>
          <p>Every ride is audit-ready with booking logs, complaints and ratings.</p>
        </article>
        <article className="insight-card">
          <p className="eyebrow">Speed</p>
          <h3>Modal-first UI</h3>
          <p>Stay in flow. Add rides without leaving your dashboard context.</p>
        </article>
      </section>

      <AddRideModal isOpen={modal.isOpen} onClose={modal.close} />
    </main>
  );
};

export default AddRidePage;



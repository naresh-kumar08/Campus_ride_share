import React, { useState } from "react";
import api from "../api";

const ComplaintForm = ({ rideId }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/complaints/add", { rideId, message });
      setMessage("");
      setStatus("Complaint submitted. We will reach out soon.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Unable to submit complaint");
    }
  };

  return (
    <form className="card grid" onSubmit={submit}>
      <h3>Complaint form</h3>
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your issue"
        required
      />
      <button className="btn">Submit complaint</button>
      {status && <small>{status}</small>}
    </form>
  );
};

export default ComplaintForm;



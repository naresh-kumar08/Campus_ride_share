import React, { useState } from "react";

const defaultFilters = {
  from: "",
  to: "",
  gender: "",
  date: "",
  maxPrice: "",
  minRating: "",
};

const RideSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form className="card search-panel" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Plan your ride</p>
          <h2>Search Ride</h2>
          {/* <p className="section-subtitle">
            Layer multiple constraints – distance, arrival window, safety preferences – and we will instantly surface the
            closest matching rides.
          </p> */}
        </div>
      </div>

      <div className="search-grid">
        <label>
          From
          <input name="from" value={filters.from} onChange={handleChange} placeholder="JECRC campus" />
        </label>
        <label>
          To
          <input name="to" value={filters.to} onChange={handleChange} placeholder="Malviya Nagar" />
        </label>
        <label>
          Gender
          <select name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Arrival date
          <input type="date" name="date" value={filters.date} onChange={handleChange} />
        </label>
        <label>
          Time slot
          <select name="time" value={filters.time || ""} onChange={handleChange}>
            <option value="">Any</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </label>
        <label>
          Max price (₹)
          <input type="number" min="0" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="200" />
        </label>
        <label>
          Min rating
          <input type="number" min="1" max="5" step="0.1" name="minRating" value={filters.minRating} onChange={handleChange} placeholder="4.5" />
        </label>
      </div>

      <button className="btn" type="submit">
        Search Rides
      </button>
    </form>
  );
};

export default RideSearch;


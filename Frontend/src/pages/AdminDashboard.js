import React, { useEffect, useMemo, useState } from "react";
import api from "../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({ role: "all", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUser, setBusyUser] = useState("");
  const [busyRide, setBusyRide] = useState("");

  const loadOverview = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, ridesRes, complaintsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/rides"),
        api.get("/admin/complaints"),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setRides(ridesRes.data.data);
      setComplaints(complaintsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filters.role !== "all" && user.role !== filters.role) {
        return false;
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        return (
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [users, filters]);

  const toggleUserStatus = async (user) => {
    const nextStatus = !user.isActive;
    setBusyUser(user._id);
    try {
      const { data } = await api.patch(`/admin/users/${user._id}/status`, { isActive: nextStatus });
      setUsers((prev) => prev.map((item) => (item._id === user._id ? data.data : item)));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update user");
    } finally {
      setBusyUser("");
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    setBusyUser(user._id);
    try {
      await api.delete(`/admin/users/${user._id}`);
      setUsers((prev) => prev.filter((item) => item._id !== user._id));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete user");
    } finally {
      setBusyUser("");
    }
  };

  const deleteRide = async (ride) => {
    if (!window.confirm("Delete this ride and its bookings?")) return;
    setBusyRide(ride._id);
    try {
      await api.delete(`/admin/rides/${ride._id}`);
      setRides((prev) => prev.filter((item) => item._id !== ride._id));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete ride");
    } finally {
      setBusyRide("");
    }
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  return (
    <main className="container grid home-page">
      <header className="card">
        <p className="eyebrow">Admin console</p>
        <h1 className="page-title">Control Center</h1>
        <p className="section-subtitle">Manage every user, ride, rating and complaint with enterprise clarity.</p>
      </header>

      {error && <div className="card text-error">{error}</div>}
      {loading && <div className="card">Loading admin data...</div>}

      {stats && (
        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">System statistics</p>
              <h2>User Status</h2>
            </div>
          </div>
          <div className="stats-grid">
            <StatTile label="Total users" value={stats.totals.users} />
            <StatTile label="Riders" value={stats.totals.riders} />
            <StatTile label="Customers" value={stats.totals.customers} />
            <StatTile label="Admins" value={stats.totals.admins} />
            <StatTile label="Inactive users" value={stats.totals.inactiveUsers} />
            <StatTile label="Active rides" value={stats.rides.active} />
            <StatTile label="Booked rides" value={stats.rides.booked} />
            <StatTile label="Completed rides" value={stats.rides.completed} />
            <StatTile label="Trips today" value={stats.rides.today} />
            <StatTile label="Bookings today" value={stats.bookings.today} />
            <StatTile label="Open complaints" value={stats.complaints.open} />
          </div>
        </section>
      )}

      <section className="card">
        <div className="section-heading">
          <h2>User Directory</h2>
          <div className="filter-bar">
            <input
              placeholder="Search name, email, phone"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <select value={filters.role} onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="all">All roles</option>
              <option value="student">Customer</option>
              <option value="rider">Rider</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Role</th>
                <th align="left">Rating</th>
                <th align="left">Status</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role === "student" ? "Customer" : user.role}</td>
                  <td>{user.rating ? `${Number(user.rating).toFixed(1)}/5` : "New"}</td>
                  <td>{user.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="history-actions">
                      <button className="btn secondary" disabled={busyUser === user._id} onClick={() => toggleUserStatus(user)}>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button className="btn destructive" disabled={busyUser === user._id} onClick={() => deleteUser(user)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredUsers.length && <div className="empty-state">No users match these filters.</div>}
        </div>
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>Trips</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th align="left">Route</th>
                <th align="left">Date & time</th>
                <th align="left">Fare</th>
                <th align="left">Status</th>
                <th align="left">Rider</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <tr key={ride._id}>
                  <td>
                    {ride.from} → {ride.to}
                  </td>
                  <td>
                    {ride.date} {ride.time}
                  </td>
                  <td>₹{ride.fare}</td>
                  <td>{ride.status}</td>
                  <td>
                    {ride.riderId?.name}
                    {ride.riderId?.rating !== undefined && ` (${Number(ride.riderId.rating).toFixed(1)}/5)`}
                  </td>
                  <td>
                    <button className="btn destructive" disabled={busyRide === ride._id} onClick={() => deleteRide(ride)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rides.length && <div className="empty-state">No rides available.</div>}
        </div>
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>Complaints</h2>
        </div>
        {!complaints.length && <div className="empty-state">No complaints filed.</div>}
        <div className="grid">
          {complaints.map((complaint) => (
            <article key={complaint._id} className="card supporting-panel">
              <p>
                <strong>Passenger:</strong> {complaint.userId?.name} ({complaint.userId?.email})
              </p>
              <p>
                <strong>Ride:</strong> {complaint.rideId?.from} → {complaint.rideId?.to} on {complaint.rideId?.date}
              </p>
              <p>
                <strong>Message:</strong> {complaint.message}
              </p>
              <small>Filed on {formatDate(complaint.createdAt)}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

const StatTile = ({ label, value }) => (
  <div className="stat-card">
    <small>{label}</small>
    <strong>{value ?? 0}</strong>
    <span>Live</span>
  </div>
);

export default AdminDashboard;


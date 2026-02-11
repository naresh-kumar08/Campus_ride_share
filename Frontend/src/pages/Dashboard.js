// import React from "react";
// import useRides from "../hooks/useRides";
// import RideCard from "../components/RideCard";
// import AddRideModal from "../components/AddRideModal";
// import useModal from "../hooks/useModal";
// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { rides, refresh } = useRides();
//   const modal = useModal();
//   const { user } = useAuth();

//   return (
//     <main className="container grid" style={{ gap: "1.5rem" }}>
//       <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div>
//           <h2>Welcome back, {user?.name}</h2>
//           <p>Keep adding rides to help your campus commute safer.</p>
//         </div>
//         <button className="btn" onClick={modal.open}>
//           Add Ride
//         </button>
//       </div>
//       <section className="grid">
//         {rides.map((ride) => (
//           <RideCard key={ride._id} ride={ride} />
//         ))}
//       </section>
//       <AddRideModal isOpen={modal.isOpen} onClose={modal.close} onSuccess={refresh} />
//     </main>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import useRides from "../hooks/useRides";
import RideCard from "../components/RideCard";
import AddRideModal from "../components/AddRideModal";
import RideDetailsModal from "../components/RideDetailsModal";
import RideSearch from "../components/RideSearch";
import useModal from "../hooks/useModal";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { rides, refresh, setFilters } = useRides();
  const modal = useModal();
  const { user, isAuthenticated } = useAuth();

  const [selectedRide, setSelectedRide] = useState(null);
  const [booking, setBooking] = useState(false);
  const [deletingRideId, setDeletingRideId] = useState("");
  const [allRides, setAllRides] = useState([]);
  const [loadingAllRides, setLoadingAllRides] = useState(false);

  const isRider = user?.role === "rider";
  const isCustomer = user?.role === "student";

  // Load all rides for rider
  useEffect(() => {
    if (isRider) {
      const fetchAllRides = async () => {
        setLoadingAllRides(true);
        try {
          const { data } = await api.get("/rides/all");
          setAllRides(data.data || []);
        } catch {
          setAllRides([]);
        } finally {
          setLoadingAllRides(false);
        }
      };
      fetchAllRides();
    }
  }, [isRider]);

  // CUSTOMER CONFIRM BOOKING
  const confirmRide = async (bookingMessage) => {
    if (!selectedRide) return;

    setBooking(true);
    try {
      // 1. Confirm booking
      await api.post("/bookings/confirm", {
        rideId: selectedRide._id,
        bookingMessage: bookingMessage?.trim() || undefined,
      });

      // 2. Mark ride as confirmed
      // await api.patch(`/rides/${selectedRide._id}/confirm`);

      // alert(
      //   "Your seat has been booked successfully!\nThe ride is now confirmed."
      // );

      setSelectedRide(null);
      refresh();

      if (isRider) {
        const { data } = await api.get("/rides/all");
        setAllRides(data.data);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Unable to confirm ride");
    } finally {
      setBooking(false);
    }
  };

  // DELETE RIDE (Only if not confirmed)
  const handleDeleteRide = async (ride) => {
    if (ride.isConfirmed) {
      alert("This ride is confirmed and cannot be deleted.");
      return;
    }

    if (!window.confirm("Delete this ride?")) return;

    setDeletingRideId(ride._id);
    try {
      await api.delete(`/rides/${ride._id}`);

      if (isRider) {
        const { data } = await api.get("/rides/all");
        setAllRides(data.data || []);
      } else {
        refresh();
      }
    } catch {
      alert("Unable to delete ride");
    } finally {
      setDeletingRideId("");
    }
  };

  const searchRides = (filters) => {
    setFilters(filters);
    refresh(filters);
  };

  const displayRides = isRider ? allRides : rides;

  return (
    <main className="container grid home-page">
      {/* HEADER */}
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{isRider ? "Rider Workspace" : "Passenger Workspace"}</p>
            <h1 className="page-title">Welcome Back, {user?.name}</h1>
            <p className="section-subtitle">
              {isRider
                ? "Manage your ride listings and track bookings easily."
                : "Find and book rides shared by fellow students."}
            </p>
          </div>

          {isRider && (
            <button className="btn" onClick={modal.open}>
              Add Ride
            </button>
          )}
        </div>
      </section>

      {isCustomer && <RideSearch onSearch={searchRides} />}

      {/* RIDE LIST */}
      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{isRider ? "Your posted rides" : "Available rides"}</p>
            <h2>Your Ride Feed</h2>
          </div>
          <span className="badge">{displayRides.length} rides</span>
        </div>

        {loadingAllRides && isRider ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <div className="rides-grid">
            {displayRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                currentUser={user}
                showDelete={isRider && !ride.isConfirmed}
                isDeleting={deletingRideId === ride._id}
                onDelete={() => handleDeleteRide(ride)}
                onSelect={() => {
                  if (isCustomer && isAuthenticated) setSelectedRide(ride);
                }}
              />
            ))}
          </div>
        )}

        {!displayRides.length && <div className="empty-state">No rides found.</div>}
      </section>

      {/* MODALS */}
      {isRider && (
        <AddRideModal
          isOpen={modal.isOpen}
          onClose={modal.close}
          onSuccess={() => {
            refresh();
            api.get("/rides/all").then(({ data }) => setAllRides(data.data));
          }}
        />
      )}

      {isCustomer && (
        <RideDetailsModal
          ride={selectedRide}
          isBooking={booking}
          onConfirm={confirmRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </main>
  );
};

export default Dashboard;

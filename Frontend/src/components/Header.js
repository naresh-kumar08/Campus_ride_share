import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="primary-header">
      <div className="container header-inner">
        <Link to="/" className="brand-mark" onClick={closeMenu}>
          <strong>
            Campus Ride Share <span>Live</span>
          </strong>
          
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle navigation">
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className={navClass} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className={navClass} onClick={closeMenu}>
            About
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/previous-rides" className={navClass} onClick={closeMenu}>
                History
              </NavLink>
              <NavLink to="/profile#ratings" className={navClass} onClick={closeMenu}>
                Ratings
              </NavLink>
              <NavLink to="/profile" className={navClass} onClick={closeMenu}>
                Profile
              </NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className={navClass} onClick={closeMenu}>
                  Admin
                </NavLink>
              )}
              <button className="btn secondary" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass} onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn" onClick={closeMenu}>
                Registration
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

// import React, { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Header = () => {
//   const { isAuthenticated, logout, user } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
//   const closeMenu = () => setMenuOpen(false);
//   const handleLogout = () => {
//     closeMenu();
//     logout();
//   };

//   return (
//     <header className="primary-header fixed-header">  {/* ✅ FIXED HEADER CLASS ADDED */}
//       <div className="container header-inner">
//         <Link to="/" className="brand-mark" onClick={closeMenu}>
//           <strong>
//             Campus Ride Share <span>Live</span>
//           </strong>
//         </Link>

//         <button className="nav-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle navigation">
//           {menuOpen ? "✕" : "☰"}
//         </button>

//         <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
//           <NavLink to="/" className={navClass} onClick={closeMenu}>
//             Home
//           </NavLink>
//           <NavLink to="/about" className={navClass} onClick={closeMenu}>
//             About
//           </NavLink>

//           {isAuthenticated ? (
//             <>
//               <NavLink to="/dashboard" className={navClass} onClick={closeMenu}>
//                 Dashboard
//               </NavLink>
//               <NavLink to="/previous-rides" className={navClass} onClick={closeMenu}>
//                 History
//               </NavLink>
//               <NavLink to="/profile#ratings" className={navClass} onClick={closeMenu}>
//                 Ratings
//               </NavLink>
//               <NavLink to="/profile" className={navClass} onClick={closeMenu}>
//                 Profile
//               </NavLink>
//               {user?.role === "admin" && (
//                 <NavLink to="/admin" className={navClass} onClick={closeMenu}>
//                   Admin
//                 </NavLink>
//               )}
//               <button className="btn secondary" type="button" onClick={handleLogout}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <NavLink to="/login" className={navClass} onClick={closeMenu}>
//                 Login
//               </NavLink>
//               <NavLink to="/register" className="btn" onClick={closeMenu}>
//                 Registration
//               </NavLink>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

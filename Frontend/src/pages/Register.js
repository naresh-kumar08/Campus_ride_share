// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import api from "../api";

// const Register = () => {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "male",
//     password: "",
//     role: "student",
//   });
//   const [code, setCode] = useState("");
//   const [step, setStep] = useState(1);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const submitRegistration = async (e) => {
//     e.preventDefault();
//     try {
//       await register(form);
//       setMessage("Check your email for the verification code.");
//       setStep(2);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Registration failed");
//     }
//   };

//   const verifyCode = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/auth/verify-email", { email: form.email, code });
//       alert("Email verified. You can now login.");
//       navigate("/login");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Invalid code");
//     }
//   };

//   return (
//     <main className="container form-page">
//       <section className="card supporting-panel">
//         <p className="eyebrow">Create account</p>
//         <h1 className="page-title">Join the verified network</h1>
//         <p className="section-subtitle">
//           Choose whether you ride or drive and gain access to a curated network of pre-verified campus commuters.
//         </p>
//         <ul className="list-clean">
//           <li>Dedicated admin safety desk with helpline coverage</li>
//           <li>Smart dashboard with live ride metrics</li>
//           <li>Ratings, complaints and audit logs for every trip</li>
//         </ul>
//       </section>

//       {step === 1 ? (
//         <form className="card form-panel grid" onSubmit={submitRegistration}>
//           <label>
//             Name
//             <input name="name" value={form.name} onChange={handleChange} required />
//           </label>
//           <label>
//             Email
//             <input type="email" name="email" value={form.email} onChange={handleChange} required />
//           </label>
//           <label>
//             Phone
//             <input name="phone" value={form.phone} onChange={handleChange} required />
//           </label>
//           <label>
//             Gender
//             <select name="gender" value={form.gender} onChange={handleChange}>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </label>
//           <label>
//             Role
//             <select name="role" value={form.role} onChange={handleChange}>
//               <option value="student">Customer / Student</option>
//               <option value="rider">Rider</option>
//             </select>
//           </label>
//           <label>
//             Password
//             <input type="password" name="password" value={form.password} onChange={handleChange} required />
//           </label>
//           <button className="btn">Register</button>
//           {message && <small>{message}</small>}
//           <Link to="/login">Already registered? Login</Link>
//         </form>
//       ) : (
//         <form className="card form-panel grid" onSubmit={verifyCode}>
//           <h2>Email verification</h2>
//           <p className="section-subtitle">Enter the OTP sent to {form.email}. It expires in 10 minutes.</p>
//           <label>
//             Code
//             <input value={code} onChange={(e) => setCode(e.target.value)} required />
//           </label>
//           <button className="btn">Verify</button>
//           {message && <small>{message}</small>}
//         </form>
//       )}
//     </main>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    password: "",
    role: "student",
  });
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitRegistration = async (e) => {
    e.preventDefault();

    // 🔥🔥 FRONTEND EMAIL DOMAIN FILTER (ADDED)
    if (!form.email.toLowerCase().endsWith("@jecrcu.edu.in")) {
      setMessage("Only @jecrcu.edu.in emails are allowed!");
      return;
    }
    // 🔥🔥 FILTER END

    try {
      await register(form);
      setMessage("Check your email for the verification code.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-email", { email: form.email, code });
      alert("Email verified. You can now login.");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid code");
    }
  };

  return (
    <main className="container form-page">
      <section className="card supporting-panel">
        <p className="eyebrow">Create Account</p>
        <h1 className="page-title">Welcome To</h1>
        <h2 c>Campus Ride Share</h2>
        {/* <p className="section-subtitle">
          Choose whether you ride or drive and gain access to a curated network of pre-verified campus commuters.
        </p>
        <ul className="list-clean">
          <li>Dedicated admin safety desk with helpline coverage</li>
          <li>Smart dashboard with live ride metrics</li>
          <li>Ratings, complaints and audit logs for every trip</li>
        </ul> */}
      </section>

      {step === 1 ? (
        <form className="card form-panel grid" onSubmit={submitRegistration}>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Customer / Student</option>
              <option value="rider">Rider</option>
            </select>
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <button className="btn">Register</button>
          {message && <small>{message}</small>}
          <Link to="/login">Already registered? Login</Link>
        </form>
      ) : (
        <form className="card form-panel grid" onSubmit={verifyCode}>
          <h2>Email verification</h2>
          <p className="section-subtitle">Enter the OTP sent to {form.email}. It expires in 10 minutes.</p>
          <label>
            Code
            <input value={code} onChange={(e) => setCode(e.target.value)} required />
          </label>
          <button className="btn">Verify</button>
          {message && <small>{message}</small>}
        </form>
      )}
    </main>
  );
};

export default Register;

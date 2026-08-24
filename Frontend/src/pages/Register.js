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

//     // 🔥🔥 FRONTEND EMAIL DOMAIN FILTER (ADDED)
//     if (!form.email.toLowerCase().endsWith("@jecrcu.edu.in")) {
//       setMessage("Only @jecrcu.edu.in emails are allowed!");
//       return;
//     }
//     // 🔥🔥 FILTER END

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
//       await api.post("/api/auth/verify-email", { email: form.email, code });
//       alert("Email verified. You can now login.");
//       navigate("/login");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Invalid code");
//     }
//   };

//   return (
//     <main className="container form-page">
//       <section className="card supporting-panel">
//         <p className="eyebrow">Create Account</p>
//         <h1 className="page-title">Welcome To</h1>
//         <h2 c>Campus Ride Share</h2>
//         {/* <p className="section-subtitle">
//           Choose whether you ride or drive and gain access to a curated network of pre-verified campus commuters.
//         </p>
//         <ul className="list-clean">
//           <li>Dedicated admin safety desk with helpline coverage</li>
//           <li>Smart dashboard with live ride metrics</li>
//           <li>Ratings, complaints and audit logs for every trip</li>
//         </ul> */}
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

  // Registration form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    password: "",
    role: "student",
  });

  // OTP
  const [code, setCode] = useState("");

  // Step 1 = Registration Form
  // Step 2 = OTP Verification
  const [step, setStep] = useState(1);

  // Message / Error
  const [message, setMessage] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Registration submit
  const submitRegistration = async (e) => {
    e.preventDefault();

    // Clear old message
    setMessage("");

    // Basic validation
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    // Email validation
    if (!form.email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    /*
    IMPORTANT:

    Agar sirf JECRC University ke students ko allow karna hai
    to ye code uncomment karna.

    Agar Gmail aur other emails se bhi registration allow karna hai,
    to ise commented hi rehne do.
    */

    /*
    if (!form.email.toLowerCase().endsWith("@jecrcu.edu.in")) {
      setMessage("Only @jecrcu.edu.in emails are allowed!");
      return;
    }
    */

    try {
      setLoading(true);

      console.log("Registration request sending...");
      console.log("Form data:", form);

      // Call register function from AuthContext
      const response = await register(form);

      console.log(
        "Registration successful:",
        response
      );

      // Registration successful
      setMessage(
        "Registration successful! Check your email for the verification code."
      );

      // Open OTP page
      setStep(2);

    } catch (err) {
      console.error(
        "Registration Error:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setMessage(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  // OTP verification
  const verifyCode = async (e) => {
    e.preventDefault();

    setMessage("");

    // Check OTP
    if (!code) {
      setMessage("Please enter the verification code.");
      return;
    }

    try {
      setLoading(true);

      console.log("Verifying OTP...");
      console.log("Email:", form.email);
      console.log("Code:", code);

      const response = await api.post(
        "/api/auth/verify-email",
        {
          email: form.email,
          code: code,
        }
      );

      console.log(
        "OTP verification successful:",
        response.data
      );

      alert(
        "Email verified successfully! You can now login."
      );

      navigate("/login");

    } catch (err) {
      console.error(
        "OTP Verification Error:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid or expired verification code.";

      setMessage(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container form-page">

      {/* Left Side Information */}
      <section className="card supporting-panel">

        <p className="eyebrow">
          Create Account
        </p>

        <h1 className="page-title">
          Welcome To
        </h1>

        <h2>
          Campus Ride Share
        </h2>

      </section>


      {/* STEP 1 - REGISTRATION FORM */}

      {step === 1 ? (

        <form
          className="card form-panel grid"
          onSubmit={submitRegistration}
        >

          <h2>
            Create Your Account
          </h2>


          {/* Name */}

          <label>
            Name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </label>


          {/* Email */}

          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>


          {/* Phone */}

          <label>
            Phone

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </label>


          {/* Gender */}

          <label>
            Gender

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </label>


          {/* Role */}

          <label>
            Role

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >

              <option value="student">
                Customer / Student
              </option>

              <option value="rider">
                Rider
              </option>

            </select>

          </label>


          {/* Password */}

          <label>
            Password

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

          </label>


          {/* Register Button */}

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >

            {loading
              ? "Registering..."
              : "Register"
            }

          </button>


          {/* Message */}

          {message && (
            <small>
              {message}
            </small>
          )}


          {/* Login Link */}

          <Link to="/login">
            Already registered? Login
          </Link>

        </form>

      ) : (

        /* STEP 2 - OTP VERIFICATION */

        <form
          className="card form-panel grid"
          onSubmit={verifyCode}
        >

          <h2>
            Email Verification
          </h2>

          <p className="section-subtitle">

            Enter the OTP sent to:

            <br />

            <strong>
              {form.email}
            </strong>

          </p>


          {/* OTP */}

          <label>

            Verification Code

            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              placeholder="Enter verification code"
              required
            />

          </label>


          {/* Verify Button */}

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Verify Email"
            }

          </button>


          {/* Message */}

          {message && (
            <small>
              {message}
            </small>
          )}


          {/* Back Button */}

          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setStep(1);
              setMessage("");
              setCode("");
            }}
          >

            Back to Registration

          </button>

        </form>

      )}

    </main>
  );
};

export default Register;

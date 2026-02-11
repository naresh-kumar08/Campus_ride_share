  // import React from "react";

  // const About = () => (
  //   <main className="container grid home-page">
  //     <section className="card">
  //       <p className="eyebrow">Our mission</p>
  //       <h1 className="page-title">Campus Ride Share</h1>
  //       <p className="section-subtitle">
  //         We design premium-grade mobility software that puts campus safety and transparency first. Every screen in the
  //         product has been rebuilt for clarity, hierarchy and intent so students always know what happens next.
  //       </p>
  //       <ul className="list-clean">
  //         <li>OTP style verification with JWT guardrails on every route</li>
  //         <li>Fare caps (₹5/km) and real-time ride visibility ensure trust</li>
  //         <li>Complaints + double-sided ratings feed an admin oversight loop</li>
  //         <li>Helpline escalation banner is always a tap away</li>
  //       </ul>
  //     </section>

  //     <section className="insights-grid">
  //       <article className="insight-card">
  //         <p className="eyebrow">Design system</p>
  //         <h3>Neo-glass aesthetic</h3>
  //         <p>Soft gradients, frosted panels, spatial typography and micro-interactions reinforce a premium SaaS brand.</p>
  //       </article>
  //       <article className="insight-card">
  //         <p className="eyebrow">Safety</p>
  //         <h3>Helpline-first UX</h3>
  //         <p>Every booking, complaint and rating threads into the helpline timeline for swift intervention.</p>
  //       </article>
  //       <article className="insight-card">
  //         <p className="eyebrow">Performance</p>
  //         <h3>Pure React</h3>
  //         <p>We stay framework-light for maximum control, ensuring accessible, responsive experiences everywhere.</p>
  //       </article>
  //     </section>
  //   </main>
  // );

  // export default About;

  // import React from "react";

  // const About = () => (
  //   <main className="container grid home-page">
  //     <section className="card">
  //       <p className="eyebrow">Our mission</p>
  //       <h1 className="page-title">Campus Ride Share</h1>
  //       <p className="section-subtitle">
  //         We design premium-grade mobility software that puts campus safety and transparency first. Every screen in the
  //         product has been rebuilt for clarity, hierarchy and intent so students always know what happens next.
  //       </p>
  //       <ul className="list-clean">
  //         <li>OTP style verification with JWT guardrails on every route</li>
  //         <li>Fare caps (₹5/km) and real-time ride visibility ensure trust</li>
  //         <li>Complaints + double-sided ratings feed an admin oversight loop</li>
  //         <li>Helpline escalation banner is always a tap away</li>
  //       </ul>
  //     </section>

  //     <section className="insights-grid">
  //       <article className="insight-card">
  //         <p className="eyebrow">Design system</p>
  //         <h3>Neo-glass aesthetic</h3>
  //         <p>Soft gradients, frosted panels, spatial typography and micro-interactions reinforce a premium SaaS brand.</p>
  //       </article>
  //       <article className="insight-card">
  //         <p className="eyebrow">Safety</p>
  //         <h3>Helpline-first UX</h3>
  //         <p>Every booking, complaint and rating threads into the helpline timeline for swift intervention.</p>
  //       </article>
  //       <article className="insight-card">
  //         <p className="eyebrow">Performance</p>
  //         <h3>Pure React</h3>
  //         <p>We stay framework-light for maximum control, ensuring accessible, responsive experiences everywhere.</p>
  //       </article>
  //     </section>

  //     {/* 🔥 New Credits Section Added Here */}
  //     <section className="card" style={{ marginTop: "2rem" }}>
  //       <p className="eyebrow">Project Contributors</p>
  //       <h2 className="page-title">Development Credits</h2>
  //       <br />
  //       <ul className="list-clean">
  //         <li>
  //           <strong>Name:- Naresh Kumar</strong> <br />  
  //           <strong>Role:</strong> -  Backend Development, Frontend Development, Security, Database Management  
  //           <br />
  //           Email:- <a href="mailto:seervinaresh620@gmail.com">seervinaresh620@gmail.com</a>  
  //           <br />
  //           Collage Email:- <a href="mailto:naresh.24bcan0358@jecrcu.edu.in">naresh.24bcan0358@jecrcu.edu.in</a>
  //         </li>

  //         <li style={{ marginTop: "1rem" }}>
  //           <strong>Pranav Dhingra</strong><br />
  //           <strong>Role:</strong> -Complete UI / UX & Design Work
            
  //           <br />
  //           Email:- <a href="mailto:parthdhingra318@gmail.com">parthdhingra318@gmail.com</a>  
  //           <br />
  //           Collage Email:- <a href="mailto:pranav.24bcan0263@jecrcu.edu.in">pranav.24bcan0263@jecrcu.edu.in</a>
  //         </li>
  //       </ul>
  //     </section>
  //   </main>
  // );

  // export default About;

  import React from "react";

const About = () => (
  <main className="container grid home-page">

    <section className="card">
      <p className="eyebrow">About the Platform</p>
      <h1 className="page-title">Campus RideShare</h1>

      <p className="section-subtitle">
        Campus RideShare is a secure and efficient ride-sharing platform designed specially for
        students. The system minimses travel cost, reduces campus congestion, promotes a more
        sustainable and eco-friendly commute. It connect students who have vacant seats in their
        vehicles with who need a safe and reliable ride — enabling seamless cost-sharing and
        smarter mobility inside the campus.
      </p><br /><br />

      <ul className="list-clean">
        <li>Verified students can only use this platform with mandatory @jecrcu.edu.in identity checks.</li>
        <li>Support cab and bike ride sharing to reduce individual travel expenses.</li>
        <li>Promotes sustainable travel by maximising vehicle seat utilization.</li>
        <li>OTP Based security ensures only trusted users can participate.</li>
        <li>Transparent fare model with a capped cost of ₹5/km.</li>
        <li>Live ride visibility for continuous user safety and trust.</li>
        <li>Complaint system and two-sided rating process for accountability.</li>
        <li>Immediate help and support in emergency situations.</li>
      </ul>

      <h3 style={{ marginTop: "1.5rem" }}>Emergency Helpline</h3>
      <ul className="list-clean">
        <li><strong>Police Emergency:</strong> 100</li>
        <li><strong>Women Safety Helpline:</strong> 1091</li>
        <li><strong>Campus Security Desk:</strong> +91 00000 00000</li>
      </ul>
    </section>

   {/* <section className="insights-grid">
       <article className="insight-card">
        <p className="eyebrow">Design System</p>
        <h3>Clarity-First UI</h3>
        <p>
          The interface follows a minimal, student-friendly visual system that prioritizes clarity,
          usability and fast decision-making. Every screen is structured to guide users without confusion.
        </p>
      </article>

      <article className="insight-card">
        <p className="eyebrow">Safety</p>
        <h3>Zero-Compromise Security</h3>
        <p>
          OTP-based verification, JWT route protection and continuous ride visibility ensure a safe
          environment where only genuine students can participate in ride sharing.
        </p>
      </article>

      <article className="insight-card">
        <p className="eyebrow">Performance</p>
        <h3>Optimized for Students</h3>
        <p>
          Built with lightweight, high-performance React components for speed, accessibility and a
          smooth experience across all devices.
        </p>
      </article> 
    </section>*/}

    <section className="card" style={{ marginTop: "2rem" }}>
      <p className="eyebrow">Project Contributors</p>
      <h2 className="page-title">Design and Developed By</h2>
      <br />

      <ul className="list-clean">
       <li style={{ marginTop: "1rem" }}>
          <strong>Name:</strong> Amir Hussain <br/>
          <strong>Role:</strong> Mentor(IT TRAINER/SME | Xebia | JECRC) <br />
          {/* <strong>Email:</strong> <a href="mailto:parthdhingra318@gmail.com"></a> <br /> */}
          
        </li>
        <li>
          <strong>Name:</strong> Naresh Kumar <br/>
          <strong>Role:</strong> Backend Development, Frontend Development, Security, Database Management <br />
          <strong>Email:</strong> <a href="mailto:seervinaresh620@gmail.com">seervinaresh620@gmail.com</a> <br />
          <strong>College Email:</strong> <a href="mailto:naresh.24bcan0358@jecrcu.edu.in">naresh.24bcan0358@jecrcu.edu.in</a>
        </li>

        <li style={{ marginTop: "1rem" }}>
          <strong>Name:</strong> Pranav Dhingra <br/>
          <strong>Role:</strong> Complete UI / UX & Design Work <br />
          <strong>Email:</strong> <a href="mailto:parthdhingra318@gmail.com">parthdhingra318@gmail.com</a> <br />
          <strong>College Email:</strong> <a href="mailto:pranav.24bcan0263@jecrcu.edu.in">pranav.24bcan0263@jecrcu.edu.in</a>
        </li>
      </ul>
    </section>
  </main>
);

export default About;

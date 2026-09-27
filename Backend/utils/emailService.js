const nodemailer = require("nodemailer");

/**
 * Creates a new transporter every time it's called.
 * This is intentional — env vars are read lazily so they are
 * always available even on platforms like Render that inject
 * them after module load.
 */
function createTransporter() {
  const user = process.env.SENDER_EMAIL_ADDRESS;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    // Increase timeout for slow connections (Render free tier)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Sends an email. Returns true on success, false if credentials
 * are missing or sending fails. Never throws — callers decide
 * how to handle the failure.
 */
async function sendEmail({ to, subject, text }) {
  const user = process.env.SENDER_EMAIL_ADDRESS;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.warn(
      "Email credentials (SENDER_EMAIL_ADDRESS / EMAIL_PASSWORD) are not set. Skipping email send."
    );
    return false;
  }

  const transporter = createTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `"Campus Ride Share" <${user}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to} — subject: "${subject}"`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return false;
  }
}

module.exports = { sendEmail };

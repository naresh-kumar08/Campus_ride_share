const appName = "Campus Ride Share";

const verificationTemplate = (name, token) => ({
  subject: `${appName} - Verify your email`,
  text: `Hi ${name},

Please verify your email to activate your ${appName} account.

Verification code: ${token}

If you did not sign up, please ignore this email. 
Thank you for visiting Campus ride share`,
});

const bookingNotificationTemplate = (name, ride, passengerName, bookingMessage) => ({
  subject: `${appName} - Ride booked`,
  text: `Hi ${name},

${passengerName} just booked your ride from ${ride.from} to ${ride.to} scheduled on ${ride.date} at ${ride.time}.

Passenger instructions:
${bookingMessage || "No additional instructions were shared."}

Please reach out to coordinate the trip.

Team ${appName}`,
});

const bookingCancellationTemplate = (name, ride) => ({
  subject: `${appName} - Booking request cancelled`,
  text: `Hi ${name},

We're sorry to announce that your booking request has been cancelled. from ${ride.from} to ${ride.to} on ${ride.date} at ${ride.time} has been cancelled The rider has not accepted your request.

We request you to explore other ride options available in the app.

Team ${appName}
Best regards`,
});

const bookingConfirmationTemplate = (customerName, riderName, ride) => ({
  subject: "Ride Confirmed",
  text: `Hi ${customerName},

Your ride has been confirmed.

Rider: ${riderName || "Your rider"}
From: ${ride.from}
To: ${ride.to}
Date: ${ride.date}
Time: ${ride.time}

Have a nice trip, enjoy!
Team ${appName}
Best regards`,
});

const forgotPasswordTemplate = (name, token) => ({
  subject: `${appName} - Password reset`,
  text: `Hi ${name},

Use the following reset OTP to change your password:

Reset OTP: ${token}

If you did not request this, please ignore the email.`,
});

module.exports = {
  verificationTemplate,
  bookingNotificationTemplate,
  bookingCancellationTemplate,
  bookingConfirmationTemplate,
  forgotPasswordTemplate,
};



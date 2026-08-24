require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const createError = require("http-errors");

const dayjs = require("dayjs");
const customParseFormat = require(
  "dayjs/plugin/customParseFormat"
);

const authRoutes = require("./routes/auth");
const rideRoutes = require("./routes/rideRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const errorHandler = require(
  "./middleware/errorHandler"
);

const Ride = require("./models/Ride");

dayjs.extend(customParseFormat);
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

// Environment variable frontend URL
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "Blocked by CORS:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

app.use(helmet());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Campus Ride Share API is running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/rides",
  rideRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/rating",
  ratingRoutes
);

app.use(
  "/api/complaints",
  complaintRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);


app.use((req, res, next) => {
  next(
    createError(
      404,
      "Route not found"
    )
  );
});


app.use(errorHandler);


const startServer = async () => {
  const PORT = process.env.PORT || 8000;

  try {
    // Check database variable
    if (!process.env.DATABASE) {
      throw new Error(
        "DATABASE environment variable is missing."
      );
    }

    // Connect MongoDB
    await mongoose.connect(
      process.env.DATABASE
    );

    console.log(
      "MongoDB connected successfully"
    );

    // Start server
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Server startup error:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

const cronExpression =
  process.env.cronBalanceTimings ||
  "0 0 * * *";

cron.schedule(
  cronExpression,
  async () => {
    try {
      const now = dayjs();

      const rides = await Ride.find({
        status: {
          $in: [
            "active",
            "booked",
          ],
        },
      });

      const updates = rides
        .filter((ride) => {
          const rideDate = dayjs(
            `${ride.date} ${ride.time}`,
            [
              "YYYY-MM-DD hh:mm A",
              "YYYY-MM-DD HH:mm",
            ],
            true
          );

          return (
            rideDate.isValid() &&
            rideDate.isBefore(now)
          );
        })
        .map((ride) => ride._id);

      if (updates.length > 0) {
        await Ride.updateMany(
          {
            _id: {
              $in: updates,
            },
          },
          {
            status: "completed",
          }
        );

        console.log(
          `Cron job: marked ${updates.length} rides as completed`
        );
      }

    } catch (error) {
      console.error(
        "Cron job error:",
        error.message
      );
    }
  }
);

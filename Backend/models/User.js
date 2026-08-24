const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // User Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Phone Number
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Gender
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    // Password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // User Rating
    rating: {
      type: Number,
      default: 5,
    },

    // Completed Rides
    ridesCompleted: {
      type: Number,
      default: 0,
    },

    // User Role
    role: {
      type: String,
      enum: ["student", "rider"],
      default: "student",
    },

    // Email Verification Status
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // OTP for Email Verification
    emailVerificationToken: {
      type: String,
      default: null,
    },

    // OTP Expiry Time
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
    },

    // Password Reset Token
    resetPasswordToken: {
      type: String,
      default: null,
    },

    // Password Reset Token Expiry
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================
// HASH PASSWORD BEFORE SAVING USER
// ==========================================

userSchema.pre("save", async function (next) {
  try {
    // Password change nahi hua hai
    // to dobara hash mat karo
    if (!this.isModified("password")) {
      return next();
    }

    // Generate Salt
    const salt = await bcrypt.genSalt(10);

    // Hash Password
    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();

  } catch (error) {
    next(error);
  }
});

// ==========================================
// COMPARE PASSWORD METHOD
// ==========================================

userSchema.methods.comparePassword =
  async function (candidatePassword) {
    return await bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

// ==========================================
// CREATE USER MODEL
// ==========================================

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;

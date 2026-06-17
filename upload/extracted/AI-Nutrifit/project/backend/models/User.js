import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // --- Core Identity ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // --- AI Biometric Matrix (From Onboarding) ---
    age: { type: Number },
    gender: { type: String },
    weight: { type: Number }, // kg
    height: { type: Number }, // cm
    stepGoal: { type: Number },
    exerciseType: { type: String },
    dietPreference: { type: String },
    isOnboarded: { type: Boolean, default: false }, // Trigger to lock the onboarding route
  },
  { timestamps: true },
);

// --- SECURITY: Password Hashing Pre-Save Hook ---
userSchema.pre("save", async function (next) {
  // If the password hasn't been changed, move on
  if (!this.isModified("password")) {
    next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- SECURITY: Password Comparison Method ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

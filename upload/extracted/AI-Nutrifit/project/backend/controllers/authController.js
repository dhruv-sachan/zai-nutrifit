import User from "../models/User.js";
import jwt from "jsonwebtoken";

// --- JWT GENERATOR ---
const generateToken = (res, userId) => {
  // Sign the token with your secret key
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Store the token in a secure HttpOnly cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Javascript cannot access this (prevents XSS attacks)
    secure: process.env.NODE_ENV !== "development", // Uses HTTPS in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// --- REGISTER LOGIC ---
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create the user in MongoDB
    const user = await User.create({
      name,
      email,
      password, // Note: bcrypt automatically hashes this because of our User.js model!
    });

    if (user) {
      // 3. Generate the JWT Cookie
      generateToken(res, user._id);

      // 4. Send back success response (but NEVER send back the password)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const { Router } = require("express");
const User = require("../models/User");
const crypto = require("crypto");

const router = Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Let the User model's pre-save hook handle hashing
    const newUser = new User({
      fullName,
      email,
      password,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use model helper to validate password
    let user;
    try {
      user = await User.matchPassword(email, password);
    } catch (e) {
      const message =
        e.message === "User not found!"
          ? "User not found"
          : "Incorrect password";
      return res.status(400).json({ message });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    console.log("✅ User Logged In:", req.session.user);
    return res.json({ success: true, redirect: "/blogs.html" });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, redirect: "/login.html" });
  });
});

// (Removed /user/me)

module.exports = router;

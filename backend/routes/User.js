const { Router } = require("express");
const path = require("path");
const User = require("../models/user");
const session = require("express-session");
const crypto = require("crypto");

const router = Router();

// Session Middleware
router.use(
  session({
    secret: "inview_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Serve Login Page
router.get("/login", (req, res) => {
  return res.sendFile(path.join(__dirname, "../frontend/public/login.html"));
});

// Serve Signup Page
router.get("/signup", (req, res) => {
  return res.sendFile(path.join(__dirname, "../frontend/public/signup.html"));
});

// Handle Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

    const newUser = new User({ fullName, email, password: hashedPassword, salt });
    await newUser.save();
    
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Handle Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const userProvidedHash = crypto.createHmac("sha256", user.salt).update(password).digest("hex");

    if (user.password !== userProvidedHash) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    req.session.user = { id: user._id, email: user.email, fullName: user.fullName };

    console.log("✅ User Logged In:", req.session.user);
    return res.redirect("/blogs.html"); // Redirect to blogs page after login
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;

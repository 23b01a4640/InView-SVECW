const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors"); // Import CORS
const userRoute = require("./routes/User");
const blogRoute = require("./routes/Blog");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes with credentials support
app.use(
  cors({
    origin: ["http://localhost:8000", "http://127.0.0.1:8000"],
    credentials: true,
  })
);

// Connect to MongoDB
// Connect to MongoDB Atlas

mongoose.connect(process.env.MONGO_URI, {
  ssl: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(
  session({
    secret: "inview_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax" },
  })
);

// Protect Blogs Page - Redirect to login if not logged in
app.get("/blogs.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/public/blogs.html"));
});

// Serve static files after protected route so /blogs.html can be gated
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () =>
  console.log(`🚀 Server started at http://localhost:${PORT}`)
);

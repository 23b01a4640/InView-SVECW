const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors"); // Import CORS
const userRoute = require("./routes/User");
const blogRoute = require("./routes/Blog");

const app = express();
const PORT = 8000;

// Enable CORS for all routes
app.use(cors()); // Add this line to allow cross-origin requests

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/InView", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Session Middleware
app.use(
  session({
    secret: "inview_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Protect Blogs Page - Redirect to login if not logged in
app.get("/blogs.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "../frontend/public/blogs.html"));
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));

const { Router } = require("express");
const Blog = require("../models/Blog");
const router = Router();

// Create Blog
router.post("/create", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBlog = new Blog({ title, content, author, createdAt: new Date() });
    await newBlog.save();

    console.log("✅ Blog Created:", newBlog);
    return res.status(201).json({ message: "Blog published successfully" });
  } catch (error) {
    console.error("❌ Blog Creation Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get All Blogs
router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("❌ Fetch Blogs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get My Blogs (requires session)
// (removed /mine)

// Delete Blog by id (only owner)
// (removed DELETE /:id)

module.exports = router;

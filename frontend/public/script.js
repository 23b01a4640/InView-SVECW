// Determine base URL for redirects and API calls
function api(path) {
  if (window.location.protocol === "file:" || !window.location.origin) {
    return `http://localhost:8000${path}`;
  }
  return path; // relative path keeps same-origin
}

// Handle Login
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(api(`/user/login`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  if (result.success) {
    // Ensure redirect targets the running server
    const target = result.redirect || "/blogs.html";
    window.location.href = target;
  } else {
    alert(result.message || "Login failed");
  }
});

// Handle Signup
document
  .getElementById("signup-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(api(`/user/signup`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fullName, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Signup successful! Please login.");
      window.location.href = `/login.html`;
    } else {
      alert(result.message || "Signup failed");
    }
  });

// Handle Blog Creation
document
  .getElementById("create-blog-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const author = document.getElementById("author").value;

    const response = await fetch(api(`/blog/create`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, author }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Blog published successfully!");
      window.location.href = `/blogs.html`;
    } else {
      alert(result.message || "Failed to publish blog");
    }
  });

// Fetch and display blogs
async function fetchBlogs() {
  try {
    const response = await fetch(api(`/blog/all`), {
      credentials: "include",
    });
    const blogs = await response.json();

    const blogContainer = document.getElementById("blog-list");
    if (!blogContainer) return;

    blogContainer.innerHTML = "";

    blogs.forEach((blog) => {
      const blogElement = document.createElement("div");
      blogElement.classList.add("blog-post");
      blogElement.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
        <small>By: ${blog.author} | ${new Date(
        blog.createdAt
      ).toLocaleString()}</small>
      `;
      blogContainer.appendChild(blogElement);
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

// Auto-run on blogs page
if (window.location.pathname.endsWith("/blogs.html")) {
  fetchBlogs();
}

// (Removed profile modal logic)

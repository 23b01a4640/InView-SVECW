// Handle login form submission
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:8000/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.redirected) {
    window.location.href = response.url; // Redirect to blogs.html
  } else {
    alert("Login failed. Check your email and password.");
  }
});

// Handle blog creation form submission
document.getElementById("create-blog-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const author = document.getElementById("author").value;

  const response = await fetch("http://localhost:8000/blog/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, author }),
  });

  const result = await response.json();
  
  if (response.ok) {
    alert("Blog published successfully!");
    window.location.href = "/blogs.html"; // Redirect after publishing
  } else {
    alert(result.message || "Failed to publish blog");
  }
});

// Fetch and display all blogs

async function fetchBlogs() {
  try {
    const response = await fetch("http://localhost:8000/blog/all");
    const blogs = await response.json();
    console.log(blogs); // Log the response to check if blogs are fetched

    const blogContainer = document.getElementById("blog-list");
    blogContainer.innerHTML = "";

    blogs.forEach((blog) => {
      const blogElement = document.createElement("div");
      blogElement.classList.add("blog-post");
      blogElement.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
        <small>By: ${blog.author} | ${new Date(blog.createdAt).toLocaleString()}</small>
      `;
      blogContainer.appendChild(blogElement);
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

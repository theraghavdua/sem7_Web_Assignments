document.addEventListener("DOMContentLoaded", () => {

  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (navbarPlaceholder) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(data => {
        navbarPlaceholder.innerHTML = data;
      });
  }

  const form = document.getElementById("blogForm");
  const title = document.getElementById("title");
  const image = document.getElementById("image");
  const description = document.getElementById("description");
  const publisher = document.getElementById("publisher");
  const category = document.getElementById("category");
  const editIndex = document.getElementById("editIndex");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

      const blog = {
        title: title.value,
        image: image.value,
        description: description.value,
        publisher: publisher.value,
        category: category.value,
        dateAdded: new Date().toISOString()
      };

      if (editIndex.value === "-1") {
  
        blogs.push(blog);
      } else {

        blogs[editIndex.value] = blog;
        editIndex.value = "-1";
        form.querySelector('input[type="submit"]').value = "Submit Blog";
      }

      localStorage.setItem("blogs", JSON.stringify(blogs));
      alert("Blog saved!");
      form.reset();
    });

    const params = new URLSearchParams(window.location.search);
    if (params.has("edit")) {
      const index = params.get("edit");
      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      const blog = blogs[index];
      if (blog) {
        title.value = blog.title;
        image.value = blog.image;
        description.value = blog.description;
        publisher.value = blog.publisher;
        category.value = blog.category;
        editIndex.value = index;
        form.querySelector('input[type="submit"]').value = "Update Blog";
      }
    }
  }

  const blogContainer = document.getElementById("blogContainer");

  if (blogContainer) {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortOrder = document.getElementById("sortOrder");

    searchInput?.addEventListener("input", renderBlogs);
    categoryFilter?.addEventListener("change", renderBlogs);
    sortOrder?.addEventListener("change", renderBlogs);

    renderBlogs();
  }

  function renderBlogs() {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const searchText = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const selectedCategory = document.getElementById("categoryFilter")?.value || "";
    const sort = document.getElementById("sortOrder")?.value || "newest";

    let filtered = blogs.filter(blog => {
      return (
        blog.title.toLowerCase().includes(searchText) &&
        (selectedCategory === "" || blog.category === selectedCategory)
      );
    });

    filtered.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else {
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      }
    });

    blogContainer.innerHTML = "";
    filtered.forEach((blog, index) => {
      const div = document.createElement("div");
      div.className = "blog-card";
      div.innerHTML = `
        <h2>${blog.title}</h2>
        <img src="${blog.image}" alt="Blog Image" style="max-width:100%; height:auto;">
        <p>${blog.description}</p>
        <h4>Category: ${blog.category}</h4>
        <h4>Published by: ${blog.publisher}</h4>
        <h5>Date: ${new Date(blog.dateAdded).toLocaleString()}</h5>
        <button onclick="editBlog(${index})">Edit</button>
        <button onclick="deleteBlog(${index})">Delete</button>
      `;
      blogContainer.appendChild(div);
    });
  }

  window.editBlog = function (index) {
    window.location.href = `admin.html?edit=${index}`;
  };

  window.deleteBlog = function (index) {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs.splice(index, 1);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    renderBlogs();
  };
});

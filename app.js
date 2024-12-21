import { fetchAllBlogs, fetchRelevantBlogs, fetchBlogDetail, likeBlog, unlikeBlog } from "./api.js";


$(document).ready(function () {
    console.log("App initialized.");
  });
  
  /**
 * Fetch all blogs
 */
async function fetchAllBlogs() {
  return await get("/blogs");
}

/**
 * Fetch blogs sorted by relevance
 */
async function fetchRelevantBlogs() {
  return await get("/blogs/relevance");
}

/**
 * Fetch a single blog by its slug
 */
async function fetchBlogDetail(slug) {
  return await get(`/blogs/detail/${slug}`);
}

/**
 * Like a blog
 */
async function likeBlog(slug) {
  return await post(`/blogs/like/${slug}`, {});
}

/**
 * Remove a like from a blog
 */
async function unlikeBlog(slug) {
  return await del(`/blogs/like/${slug}`);
}

export { fetchAllBlogs, fetchRelevantBlogs, fetchBlogDetail, likeBlog, unlikeBlog };

$(document).ready(function () {
  if ($(".blog-section").length) {
    loadBlogs();
  }
});

async function loadBlogs() {
  try {
    const blogs = await fetchAllBlogs();
    const blogGrid = $(".blog-grid");
    blogGrid.empty(); // Clear any placeholder content

    blogs.data.forEach((blog) => {
      const blogHTML = `
        <article class="blog-card">
          <img src="${blog.featuredImage}" alt="Blog post">
          <div class="card-content">
            <span class="tag">${blog.category[0]}</span>
            <h3>${blog.title}</h3>
            <p>${blog.shortDescription}</p>
            <div class="meta-info">
              <span>By ${blog.author?.name || "Unknown"}</span>
              <span>•</span>
              <span>${blog.readTime}</span>
            </div>
            <a href="/blog/detail/${blog.slug}" class="read-more">Read Article</a>
          </div>
        </article>
      `;
      blogGrid.append(blogHTML);
    });
  } catch (error) {
    console.error("Failed to load blogs:", error);
  }
}
$(document).on("click", ".like-btn", async function () {
  const slug = $(this).data("slug");
  try {
    await likeBlog(slug);
    alert("Blog liked!");
  } catch (error) {
    alert("Failed to like the blog.");
  }
});

$(document).on("click", ".unlike-btn", async function () {
  const slug = $(this).data("slug");
  try {
    await unlikeBlog(slug);
    alert("Blog unliked!");
  } catch (error) {
    alert("Failed to unlike the blog.");
  }
});

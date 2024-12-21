// const { title } = require("process");
// const { error } = require("console");
// const { createBlog } = require("../../Backend/controller/blogController");

$(document).ready(function () {
    const apiUrl = 'http://localhost:8089/api/v1/blogs'; // Backend API endpoint


    // Function to fetch blogs from the backend
    function fetchBlogs(){
    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: {},

        success: function (response){
            const blogs = response.data;
            const blogContainer = $('.blog-grid');

            blogContainer.empty();

            blogs.forEach(blog => {
                const blogCard = `
                    <article class="blog-card">
                        <img src="${blog.featuredImage}" alt="${blog.title}">
                        <div class="card-content">
                            <span class="tag">${blog.category[0]}</span>
                            <h3>${blog.title}</h3>
                            <p>${blog.shortDescription}</p>
                            <div class="meta-info">
                                <span>By ${blog.author?.name || 'Unknown'}</span>
                                <span>•</span>
                                <span>${blog.readTime} min read</span>
                            </div>
                        </div>
                    </article>
                `;
                blogContainer.append(blogCard);
            });
        },
        error: function (err){
            console.error('Error fetching blogs:', err);
            alert('Failed to fetch blogs. Please try again later.');
        }
    });
}
    fetchBlogs();
});

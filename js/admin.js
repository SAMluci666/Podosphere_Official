const apiBaseUrl = "http://localhost:8089/api/v1"; // Replace with your API URL

const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})
$(document).ready(() => {
    // API Endpoint
    const blogsAPI = "http://localhost:8089/api/v1/blogs";

    // Elements
    const blogsTable = $("#blogsTable");
    const addBlogModal = $("#addBlogModal");
    const addBlogForm = $("#addBlogForm");

    // View Blogs
    $("#viewBlogs").click(() => {
        blogsTable.toggleClass("hidden");
        fetchBlogs();
    });

    // Fetch Blogs
    function fetchBlogs() {
        $.get(blogsAPI, (response) => {
            const blogs = response.data;
            const tbody = blogsTable.find("tbody");
            tbody.empty();
            blogs.forEach((blog) => {
                tbody.append(`
                    <tr>
                        <td>${blog.title}</td>
                        <td>${blog.category.join(", ")}</td>
                        <td>${blog.noOfLikes}</td>
                        <td>
                            <button class="btn btn-danger delete-blog" data-id="${blog._id}">Delete</button>
                        </td>
                    </tr>
                `);
            });

            // Attach Delete Event
            $(".delete-blog").click(function () {
                const blogId = $(this).data("id");
                deleteBlog(blogId);
            });
        });
    }

    // Delete Blog
    function deleteBlog(blogId) {
        $.ajax({
            url: `${blogsAPI}/${blogId}`,
            type: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            success: () => {
                alert("Blog deleted successfully!");
                fetchBlogs();
            },
            error: (err) => {
                alert("Error deleting blog.");
                console.error(err);
            },
        });
    }

    // Show Add Blog Modal
    $("#addBlogButton").click(() => {
        addBlogModal.removeClass("hidden");
    });

    // Close Modal
    $(".close-modal").click(() => {
        addBlogModal.addClass("hidden");
    });

    // Add Blog
    addBlogForm.submit((e) => {
        e.preventDefault();
        const blogData = {
            title: $("#blogTitle").val(),
            featuredImage: $("#blogImage").val(),
            shortDescription: $("#blogShortDescription").val(),
            description: $("#blogDescription").val(),
            category: $("#blogCategory").val().split(","),
            readTime: $("#blogReadTime").val(),
        };

        $.ajax({
            url: blogsAPI,
            type: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: JSON.stringify(blogData),
            contentType: "application/json",
            success: () => {
                alert("Blog added successfully!");
                fetchBlogs();
                addBlogModal.addClass("hidden");
            },
            error: (err) => {
                alert("Error adding blog.");
                console.error(err);
            },
        });
    });
});
$(document).ready(function () {
    $("#logoutButton").click(function () {
        $.ajax({
            url: "http://localhost:8089/api/v1/accounts/logout", // Replace with your logout route
            type: "POST", // Use POST or the correct method for your API
            xhrFields: {
                withCredentials: true, // Send cookies with the request
            },
            success: function (response) {
                alert("Logout successful!");
                // Redirect to home or login page
                window.location.href = "../index.html";
            },
            error: function (xhr, status, error) {
                console.error("Error during logout:", error);
                alert("Failed to logout. Please try again.");
            },
        });
    });
});

// For managing the newsletter subscription
$(document).ready(function () {
    const newsletterAPI = "http://localhost:8089/api/v1/newsletters";

    // // Handle form submission for subscribing to the newsletter
    // $("#newsletterForm").on("submit", function (event) {
    //     event.preventDefault();

    //     const email = $("#newsletterEmail").val();

    //     $.ajax({
    //         url: newsletterAPI,
    //         type: "POST",
    //         contentType: "application/json",
    //         data: JSON.stringify({ email }),
    //         success: (response) => {
    //             alert("Thank you for subscribing!");
    //             $("#newsletterEmail").val(""); // Clear the input field
    //         },
    //         error: (xhr) => {
    //             const message = xhr.responseJSON?.message || "An error occurred. Please try again.";
    //             alert(`Error: ${message}`);
    //         },
    //     });
    // });

    // Fetch and display subscribers
    $("#viewSubscribers").on("click", function () {
        $.ajax({
            url: newsletterAPI,
            type: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Include admin token
            },
            success: (response) => {
                const tableBody = $("#subscribersTable tbody");
                tableBody.empty(); // Clear previous data

                response.data.forEach((subscriber) => {
                    const date = new Date(subscriber.createdAt).toLocaleDateString();
                    tableBody.append(`
                        <tr>
                            <td>${subscriber.email}</td>
                            <td>${date}</td>
                            <td>
                                <button class="btn btn-danger delete-subscriber" data-id="${subscriber._id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });

                $("#newsletterTableSection").show(); // Show the table section
            },
            error: (xhr) => {
                alert("Error fetching subscribers. Please try again.");
            },
        });
    });

    // Delete a subscriber
    $(document).on("click", ".delete-subscriber", function () {
        const subscriberId = $(this).data("id");

        $.ajax({
            url: `${newsletterAPI}/${subscriberId}`,
            type: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            success: () => {
                alert("Subscriber deleted successfully!");
                $("#viewSubscribers").trigger("click"); // Refresh the list
            },
            error: () => {
                alert("Error deleting subscriber. Please try again.");
            },
        });
    });
});

// For Managing the Contacts
$(document).ready(function () {
    const contactsAPI = "http://localhost:8089/api/v1/contacts";

    // Load all contacts
    $("#loadContacts").on("click", function () {
        $.ajax({
            url: contactsAPI,
            type: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Use admin token
            },
            success: (response) => {
                const tableBody = $("#contactsTable tbody");
                tableBody.empty(); // Clear previous data

                response.data.forEach((contact) => {
                    const contactedStatus = contact.contacted ? "Yes" : "No";
                    tableBody.append(`
                        <tr>
                            <td>${contact.name}</td>
                            <td>${contact.email}</td>
                            <td>${contact.phone}</td>
                            <td>${contact.message}</td>
                            <td>${contactedStatus}</td>
                            <td>
                                <button class="btn btn-success mark-contacted" data-id="${contact._id}">Mark as Contacted</button>
                            </td>
                        </tr>
                    `);
                });

                $("#contactsTable").show(); // Show the table
            },
            error: () => {
                alert("Failed to load contacts.");
            },
        });
    });

    // Mark a contact as contacted
    $(document).on("click", ".mark-contacted", function () {
        const contactId = $(this).data("id");

        $.ajax({
            url: `${contactsAPI}/${contactId}`,
            type: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            contentType: "application/json",
            data: JSON.stringify({ contacted: true }),
            success: () => {
                alert("Marked as contacted.");
                $("#loadContacts").trigger("click"); // Refresh contacts
            },
            error: () => {
                alert("Failed to update contact.");
            },
        });
    });
});
// Event Management
$(document).ready(function () {
    const adminEventsAPI = "http://localhost:8089/api/v1/events";

    // Load all events
    $("#loadEvents").on("click", function () {
        $.ajax({
            url: adminEventsAPI,
            type: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
            success: (response) => {
                const tableBody = $("#eventsTable tbody");
                tableBody.empty();

                response.data.forEach((event) => {
                    tableBody.append(`
                        <tr>
                            <td>${event.title}</td>
                            <td>${new Date(event.startDate).toLocaleDateString()}</td>
                            <td>${new Date(event.endDate).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-warning edit-event" data-id="${event._id}">Edit</button>
                                <button class="btn btn-danger delete-event" data-id="${event._id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });

                $("#eventsTable").show();
            },
            error: () => {
                alert("Failed to load events.");
            },
        });
    });

    // Add Event
    $("#addEventButton").on("click", function () {
        openEventModal("Add Event");
        $("#eventForm").off("submit").on("submit", function (e) {
            e.preventDefault();

            const eventData = {
                title: $("#eventTitle").val(),
                startDate: $("#eventStartDate").val(),
                endDate: $("#eventEndDate").val(),
                eventType: $("#eventType").val(),
                shortDescription: $("#eventShortDescription").val(),
                description: $("#eventDescription").val(),
                venue: $("#eventVenue").val(),
                featuredImage: $("#eventFeaturedImage").val(),
            };

            $.ajax({
                url: adminEventsAPI,
                type: "POST",
                data: JSON.stringify(eventData),
                contentType: "application/json",
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
                success: () => {
                    alert("Event added successfully!");
                    closeEventModal();
                    $("#loadEvents").trigger("click");
                },
                error: () => {
                    alert("Failed to add event.");
                },
            });
        });
    });

    // Edit Event
    $(document).on("click", ".edit-event", function () {
        const eventId = $(this).data("id");

        $.ajax({
            url: `${adminEventsAPI}/${eventId}`,
            type: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
            success: (response) => {
                const event = response.data;

                openEventModal("Edit Event");
                $("#eventTitle").val(event.title);
                $("#eventStartDate").val(new Date(event.startDate).toISOString().slice(0, 16));
                $("#eventEndDate").val(new Date(event.endDate).toISOString().slice(0, 16));
                $("#eventType").val(event.eventType);
                $("#eventShortDescription").val(event.shortDescription);
                $("#eventDescription").val(event.description);
                $("#eventVenue").val(event.venue);
                $("#eventFeaturedImage").val(event.featuredImage);

                $("#eventForm").off("submit").on("submit", function (e) {
                    e.preventDefault();

                    const updatedEventData = {
                        title: $("#eventTitle").val(),
                        startDate: $("#eventStartDate").val(),
                        endDate: $("#eventEndDate").val(),
                        eventType: $("#eventType").val(),
                        shortDescription: $("#eventShortDescription").val(),
                        description: $("#eventDescription").val(),
                        venue: $("#eventVenue").val(),
                        featuredImage: $("#eventFeaturedImage").val(),
                    };

                    $.ajax({
                        url: `${adminEventsAPI}/${eventId}`,
                        type: "PATCH",
                        data: JSON.stringify(updatedEventData),
                        contentType: "application/json",
                        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
                        success: () => {
                            alert("Event updated successfully!");
                            closeEventModal();
                            $("#loadEvents").trigger("click");
                        },
                        error: () => {
                            alert("Failed to update event.");
                        },
                    });
                });
            },
            error: () => {
                alert("Failed to fetch event details.");
            },
        });
    });

    // Delete Event
    $(document).on("click", ".delete-event", function () {
        const eventId = $(this).data("id");

        if (confirm("Are you sure you want to delete this event?")) {
            $.ajax({
                url: `${adminEventsAPI}/${eventId}`,
                type: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
                success: () => {
                    alert("Event deleted successfully!");
                    $("#loadEvents").trigger("click");
                },
                error: () => {
                    alert("Failed to delete event.");
                },
            });
        }
    });

    // Utility Functions
    function openEventModal(title) {
        $("#eventModalTitle").text(title);
        $("#eventModal").removeClass("hidden");
    }

    function closeEventModal() {
        $("#eventModal").addClass("hidden");
        $("#eventForm")[0].reset();
    }

    $("#closeEventModal").on("click", closeEventModal);
});
$(document).ready(() => {
    function toggleSection(buttonId, sectionId, fetchData) {
        const section = $(sectionId);

        $(buttonId).click(() => {
            if (section.is(":visible")) {
                // If visible, hide the section
                section.addClass("hidden");
            } else {
                // If hidden, show the section and fetch data
                section.removeClass("hidden");
                fetchData();
            }
        });
    }

    // Fetch Functions
    function fetchSubscribers() {
        // Add your subscriber fetching logic here
        console.log("Fetching Subscribers...");
    }

    function fetchContacts() {
        // Add your contact fetching logic here
        console.log("Fetching Contacts...");
    }

    function fetchEvents() {
        // Add your event fetching logic here
        console.log("Fetching Events...");
    }

    toggleSection("#viewSubscribers", "#subscribersTable", fetchSubscribers);
    toggleSection("#loadContacts", "#contactsTable", fetchContacts);
    toggleSection("#loadEvents", "#eventsTable", fetchEvents);
});


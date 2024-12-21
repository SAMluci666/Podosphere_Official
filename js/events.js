$(document).ready(function () {
    const baseUrl = "http://localhost:8089/api/v1/events";

    // Load upcoming events
    function loadUpcomingEvents() {
        $.ajax({
            url: `${baseUrl}/upcoming`,
            type: "GET",
            success: (response) => {
                const upcomingEvents = response.data.map((event) => `
                    <div class="col-md-4 mb-4">
                        <div class="card event-card">
                            <img src="${event.featuredImage}" class="card-img-top" alt="${event.title}">
                            <div class="card-body">
                                <h5 class="card-title">${event.title}</h5>
                                <p class="card-text">${event.shortDescription}</p>
                                <p class="event-date">Date: ${new Date(event.startDate).toLocaleDateString()}</p>
                                <a href="#" class="btn btn-primary register-btn" data-id="${event._id}">Register Now</a>
                            </div>
                        </div>
                    </div>
                `);
                $("#upcomingEventsContainer").html(upcomingEvents.join(""));
            },
            error: () => {
                alert("Failed to load upcoming events.");
            },
        });
    }

    // Load past events
    function loadPastEvents() {
        $.ajax({
            url: `${baseUrl}/past`,
            type: "GET",
            success: (response) => {
                const pastEvents = response.data.map((event, index) => `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <div class="carousel-content">
                            <img src="${event.featuredImage}" class="d-block w-100" alt="${event.title}">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>${event.title}</h5>
                                <p>${event.shortDescription}. Date: ${new Date(event.endDate).toLocaleDateString()}</p>
                                <a href="#" class="btn btn-secondary">View Details</a>
                            </div>
                        </div>
                    </div>
                `);
                $("#pastEventsContainer").html(pastEvents.join(""));
            },
            error: () => {
                alert("Failed to load past events.");
            },
        });
    }

    // Register for an event
    $(document).on("click", ".register-btn", function (event) {
        event.preventDefault();
        const eventId = $(this).data("id");

        $.ajax({
            url: `${baseUrl}/${eventId}/register`,
            type: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Ensure user is logged in
            },
            success: () => {
                alert("Successfully registered for the event.");
            },
            error: () => {
                alert("Failed to register for the event. Please log in.");
            },
        });
    });

    // Load events on page load
    loadUpcomingEvents();
    loadPastEvents();
});

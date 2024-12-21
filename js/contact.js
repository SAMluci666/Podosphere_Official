$(document).ready(function () {
    const contactAPI = "http://localhost:8089/api/v1/contacts";

    // Handle form submission
    $("#contactForm").on("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const name = $("#contactName").val();
        const email = $("#contactEmail").val();
        const phone = $("#contactPhone").val();
        const message = $("#contactMessage").val();

        // Send data to the server using AJAX
        $.ajax({
            url: contactAPI,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, email, phone, message }),
            success: (response) => {
                alert("Thank you for contacting us. We will get back to you shortly.");
                // Clear the form
                $("#contactForm")[0].reset();
            },
            error: (xhr) => {
                const message = xhr.responseJSON?.message || "An error occurred. Please try again.";
                alert(`Error: ${message}`);
            },
        });
    });
});

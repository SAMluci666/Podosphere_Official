$(document).ready(function () {
    const hiringUrl = 'http://localhost:8089/api/v1/hirings'; // Backend API endpoint


    // Function to fetch Hiring information from the backend
    function fetchHirings() {
        $.ajax({
            url: hiringUrl,
            type: 'GET',
            data: {},

            success: function (response) {
                const hirings = response.data;
                const hiringContainer = $('.hiring-grid');

                hiringContainer.empty();

                hirings.forEach(hiring => {
                    const hiringCard = `
                    <article class="hiring-card">
                        // <img src="${hiring.featuredImage}" alt="${hiring.title}">
                        <div class="hiring-content">
                            <h3>${hiring.title} at ${hiring.company}</h3>
                            <p>Opening Date: ${hiring.openingDate}</p>
                            <p>Closing Date: ${hiring.closingDate}</p>
                            <div class="hiring-info">
                                <span>${hiring.company}</span>
                                <button class="enroll-button"><a href="${hiring.link}">Apply Now</a></button>
                            </div>
                        </div>
                    </article>
                `;
                    hiringContainer.append(hiringCard);
                });
            },
            error: function (err) {
                console.error('Error fetching hirings:', err);
                alert('Failed to fetch Hirings. Please try again later.');
            }
        });
    }
    fetchHirings();
});
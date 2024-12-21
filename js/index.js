$(document).ready(function () {
    const hiringUrl = 'http://localhost:8089/api/v1/hirings'; // Backend API endpoint


    // Function to fetch Hiring information from the backend
    function fetchHirings(){
    $.ajax({
        url: hiringUrl,
        type: 'GET',
        data: {},

        success: function (response){
            const hirings = response.data;
            const hiringContainer = $('.hiring-cards');

            hiringContainer.empty();

            hirings.forEach(hiring => {
                const card = `
                    <div class="card">
                        <h3> ${hiring.title}" </h3>
                        <div class="text-container">
                            <p>Company: ${hiring.company}</p>
                            <p>Type: Full-Time</p>
                        </div>

                        <a href="${hiring.link}" class="apply-button">Apply Now</a>
                    </div>
                `;
                hiringContainer.append(card);
            });
        },
        error: function (err){
            console.error('Error fetching hirings:', err);
            alert('Failed to fetch Hirings. Please try again later.');
        }
    });
}
    fetchHirings();
});

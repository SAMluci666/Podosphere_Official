$(document).ready(function () {
    // Signup functionality
    $('.signup-form form').on('submit', function (e) {
        e.preventDefault();

        const name = $('#signup-name').val();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        const passwordConfirm = $('#signup-password-confirm').val();

        $.ajax({
            url: 'http://localhost:8089/api/v1/accounts/signup', // Backend endpoint
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                email: email,
                password: password,
                passwordConfirm: password,
            }),
            success: function (response) {
                alert('Signup successful! You can now log in.');
                $('#flip').prop('checked', false); // Switch to login form
            },
            error: function (xhr) {
                const errorResponse = xhr.responseJSON || { message: 'Unknown error occurred' };
                alert(`Signup failed: ${errorResponse.message}`);
            },
        });
    });
    // Login functionality
    $('.login-form form').on('submit', function (e) {
        e.preventDefault();

        const email = $('#login-email').val();
        const password = $('#login-password').val();

        $.ajax({
            url: 'http://localhost:8089/api/v1/accounts/login', // Backend endpoint
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password,
            }),
            success: function (response) {
                alert('Login successful!');
                localStorage.setItem('jwt', response.token); // Store JWT token as jwt
                window.location.href = '../admin/admin.html'; // Redirect to homepage
            },
            error: function (xhr) {
                alert(`Login failed: ${xhr.responseJSON.message}`);
            },
        });
    });

});
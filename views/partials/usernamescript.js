document.addEventListener('DOMContentLoaded', function () {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const usernameInput = document.getElementById('username');
    const signupForm = document.getElementById('signup-form');

    function updateUsername() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        usernameInput.value = `${firstName}.${lastName}`.toLowerCase();
    }

    firstNameInput.addEventListener('input', updateUsername);
    lastNameInput.addEventListener('input', updateUsername);

    signupForm.addEventListener('submit', function (event) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            event.preventDefault();
            alert('Passwords do not match.');
        }
    });
});
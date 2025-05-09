document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    function showToast(type, msg) {
        Toastify({
            //add close button
            close: true,
            text: msg,
            duration: 4000,
            gravity: "top",      // top | bottom
            position: "right",   // left | center | right
            style: { background: type === "error" ? "#dc2626" : "#16a34a" }
        }).showToast();
    }

    const signUpForm = document.getElementById("signUpForm");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        
        try {
            if (!email || !password || !confirmPassword || !firstName || !lastName) {
                throw new Error("Please provide all required fields");
            }
            if (firstName.trim().length === 0) {
                throw new Error("First Name cannot be empty");
            }
            if (lastName.trim().length === 0) {
                throw new Error("Last Name cannot be empty");
            }
            if (firstName.length < 2) {
                throw new Error("First Name must be at least 2 characters long");
            }
            if (firstName.length > 50) {
                throw new Error("First Name must be less than 50 characters long");
            }
            if (lastName.length < 2) {
                throw new Error("Last Name must be at least 2 characters long");
            }
            if (lastName.length > 50) {
                throw new Error("Last Name must be less than 50 characters long");
            }
            if (email.trim().length === 0) {
                throw new Error("Email cannot be empty");
            }
            if (password.trim().length === 0) {
                throw new Error("Password cannot be empty");
            }
            if (confirmPassword.trim().length === 0) {
                throw new Error("Confirm Password cannot be empty");
            }
            if (!isValidEmail(email)) {
                throw new Error("Invalid email format");
            }
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }
            if (password.length > 1024) {
                throw new Error("Password must be less than 1024 characters long");
            }
            if (confirmPassword.length < 8) {
                throw new Error(
                    "Confirm Password must be at least 8 characters long"
                );
            }
            if (confirmPassword.length > 1024) {
                throw new Error(
                    "Confirm Password must be less than 1024 characters long"
                );
            }
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            if (!isValidPassword(password)) {
                throw new Error(
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                );
            }
            if (!isValidPassword(confirmPassword)) {
                throw new Error(
                    "Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                );
            }
            // If all validations pass, submit the form
            signUpForm.submit();
        } catch (error) {
            // Show error message
            showToast("error", error.message);
        }
    }
    );
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Function to validate password strength
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
});
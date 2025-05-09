document.addEventListener("DOMContentLoaded", function () {
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

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            if (!email || !password) {
                throw new Error("Please provide all required fields");
            }
            if (email.trim().length === 0) {
                throw new Error("Email cannot be empty");
            }
            if (password.trim().length === 0) {
                throw new Error("Password cannot be empty");
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Invalid email format");
            }
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }
            if (password.length > 1024) {
                throw new Error("Password must be less than 1024 characters long");
            }
            if (password.trim().length === 0) {
                throw new Error("Password cannot be empty");
            }
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                throw new Error(
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                );
            }

            // If validation passes, submit the form
            loginForm.submit();
        } catch (error) {
            // Show error message using Toastify
            showToast("error", error.message);
        }
    });

});
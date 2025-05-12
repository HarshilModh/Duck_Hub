

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const toastMs = 2000; // toast visible time

    function showToast(type, msg, ms = toastMs) {
        Toastify({
            text: msg,
            duration: ms,
            gravity: "top",
            position: "right",
            close: true,
            style: { background: type === "error" ? "#dc2626" : "#16a34a" },
        }).showToast();
    }
    form.addEventListener("submit", function (e) {
        //submit like form.submit()
        // form.submit();
        e.preventDefault();
        try {
            let firstName = document.getElementById("firstName").value.trim();
            let lastName = document.getElementById("lastName").value.trim();
            let email = document.getElementById("email").value.trim();
            if (!firstName || !lastName || !email) {
                throw new Error("Please fill in all fields");
            }
            let nameRegex = /^[a-zA-Z]+$/;
            if (!isValidEmail(email)) {
                throw new Error("Invalid email format");
            }
            if (firstName.trim().length == 0) {
                throw new Error("First name cannot be empty");
            }
            if (lastName.trim().length == 0) {
                throw new Error("Last name cannot be empty");
            }
            if (!nameRegex.test(firstName)) {
                throw new Error("First name can only contain letters");
            }
            if (!nameRegex.test(lastName)) {
                throw new Error("Last name can only contain letters");
            }
            if (firstName.length < 2) {
                throw new Error("First name must be at least 2 characters long");
            }
            if (firstName.length > 50) {
                throw new Error("First name must be less than 50 characters long");
            }
            if (lastName.length < 2) {
                throw new Error("Last name must be at least 2 characters long");
            }
            if (lastName.length > 50) {
                throw new Error("Last name must be less than 50 characters long");
            }
            if (email.length < 5) {
                throw new Error("Email must be at least 5 characters long");
            }
            if (email.length > 50) {
                throw new Error("Email must be less than 100 characters long");
            }
            form.submit();

        } catch (error) {
            showToast("error", error.message);
        }
    });
});
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
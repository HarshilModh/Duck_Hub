
 function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
 function showToast(type, msg) {
        Toastify({
            text: msg,
            duration: 2000,
            gravity: "top",
            position: "right",  
            close: true,
            style: { background: type === "error" ? "#dc2626" : "#16a34a" },
        }).showToast();
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const currentPassword = document.getElementById("currentPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        try {
            if (!currentPassword || !newPassword || !confirmPassword) {
                throw new Error("Please fill in all fields");
            }
            if (newPassword.length < 8) {
                throw new Error("New Password must be at least 8 characters long");
            }
            if (newPassword.length > 50) {
                throw new Error("New Password must be less than 50 characters long");
            }
            if (!isValidPassword(newPassword)) {
                throw new Error("New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            }
            if (newPassword !== confirmPassword) {
                throw new Error("New Password and Confirm Password do not match");
            }
            if (currentPassword === newPassword) {
                throw new Error("New Password cannot be the same as Current Password");
            }
            if (currentPassword.length < 8) {
                throw new Error("Current Password must be at least 8 characters long");
            }
            if (currentPassword.length > 50) {
                throw new Error("Current Password must be less than 50 characters long");
            }
            if (!isValidPassword(currentPassword)) {
                throw new Error("Current Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            }

            if (currentPassword === confirmPassword) {
                throw new Error("Current Password and Confirm Password cannot be the same");
            }
            if (currentPassword === newPassword) {
                throw new Error("Current Password and New Password cannot be the same");
            }
            if (confirmPassword.length < 8) {
                throw new Error("Confirm Password must be at least 8 characters long");
            }
            if (confirmPassword.length > 50) {
                throw new Error("Confirm Password must be less than 50 characters long");
            }
            if (!isValidPassword(confirmPassword)) {
                throw new Error("Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
            }
            form.submit();
        } catch (error) {
            showToast("error", error.message);
        }
    }
    );  
});

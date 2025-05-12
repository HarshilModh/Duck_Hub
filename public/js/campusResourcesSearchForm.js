
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
        e.preventDefault();
        try {
            let search = document.querySelector('input[name="search"]').value.trim();
            if (!search) {
                showToast("error", "Please enter a search term.");
                return;
            }   
            form.submit();
        } catch (error) {
            showToast("error", error.message);
        }
    }
    );
});
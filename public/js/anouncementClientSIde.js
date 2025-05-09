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
    const anouncementForm = document.getElementById("addAnnouncementForm");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    if (!anouncementForm) {
        console.error("Announcement form not found");
        return;
    }
    anouncementForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        try {
            if (!title || !content) {
                throw new Error("Please provide all required fields");
            }
            if (title.trim().length === 0) {
                throw new Error("Title cannot be empty");
            }
            if (content.trim().length === 0) {
                throw new Error("Content cannot be empty");
            }
           

            // If validation passes, submit the form
            anouncementForm.submit();
        } catch (error) {
            // Show error message using Toastify
            showToast("error", error.message);
        }
    });
});
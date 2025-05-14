
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
            let minDifficultyRating = document.querySelector('input[name="minDifficultyRating"]').value.trim();
            let maxDifficultyRating = document.querySelector('input[name="maxDifficultyRating"]').value.trim();
            let minAverageRating = document.querySelector('input[name="minAverageRating"]').value.trim();
            let maxAverageRating = document.querySelector('input[name="maxAverageRating"]').value.trim();
            let departmentId = document.querySelector('select[name="departmentId"]').value.trim();
            if (minDifficultyRating && (isNaN(minDifficultyRating) || minDifficultyRating < 1 || minDifficultyRating > 3)) {
                throw new Error("Min Difficulty Rating must be a number between 1 and 3");
            }
            if (maxDifficultyRating && (isNaN(maxDifficultyRating) || maxDifficultyRating < 1 || maxDifficultyRating > 3)) {
                throw new Error("Max Difficulty Rating must be a number between 1 and 3");
            }
            if (minAverageRating && (isNaN(minAverageRating) || minAverageRating < 1 || minAverageRating > 5)) {
                throw new Error("Min Average Rating must be a number between 0 and 5");
            }
            if (maxAverageRating && (isNaN(maxAverageRating) || maxAverageRating < 1 || maxAverageRating > 5)) {
                throw new Error("Max Average Rating must be a number between 0 and 5");
            }
            if (minDifficultyRating && maxDifficultyRating && parseInt(minDifficultyRating) > parseInt(maxDifficultyRating)) {
                throw new Error("Min Difficulty Rating cannot be greater than Max Difficulty Rating");
            }
            if (minAverageRating && maxAverageRating && parseInt(minAverageRating) > parseInt(maxAverageRating)) {
                throw new Error("Min Average Rating cannot be greater than Max Average Rating");
            }
        
            if (!search) {
                throw new Error("Please fill in the search field");
            }
            form.submit();
        } catch (error) {
            showToast("error", error.message);
        }
    });
});
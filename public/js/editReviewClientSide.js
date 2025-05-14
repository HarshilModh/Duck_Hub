

document.addEventListener("DOMContentLoaded", () => {
    function showToast(type, msg) {
        Toastify({
        close: true,
        text: msg,
        duration: 4000,
        gravity: "top",
        position: "right",
        style: { background: type === "error" ? "#dc2626" : "#16a34a" },
        }).showToast();
    }
    
    const form = document.getElementById("editCourseReviewForm");
    const reviewInput = document.getElementById("review");
    const anonInput = document.getElementById("isAnonymous");
    const overallRatingInputs = document.querySelectorAll('input[name="overallRating"]');
    const difficultyRatingInputs = document.querySelectorAll('input[name="difficultyRating"]');
    const overallRating = Array.from(overallRatingInputs).find(input => input.checked);
    const difficultyRating = Array.from(difficultyRatingInputs).find(input => input.checked);
    const overallRatingValue = overallRating ? Number(overallRating.value) : null;
    const difficultyRatingValue = difficultyRating ? Number(difficultyRating.value) : null;
    const reviewText = reviewInput.value.trim();
    const isAnonymous = anonInput.checked;
    form.addEventListener("submit", (event) => {
        try {
        event.preventDefault();
        // Basic presence check
        if (
            !reviewText ||
            isNaN(overallRatingValue) ||
            isNaN(difficultyRatingValue)
        ) {
            throw new Error("All fields (review and both ratings) are required");
        }
        // Range checks
        if (overallRatingValue < 1 || overallRatingValue > 5) {
            throw new Error("Overall rating must be between 1 and 5");
        }
        if (difficultyRatingValue < 1 || difficultyRatingValue > 3) {
            throw new Error("Difficulty rating must be between 1 and 3");
        }
        form.submit();
        } catch (err) {
        showToast("error", err.message);
        }
    }
    );
});
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

  const form = document.getElementById("addCourseReviewForm");
  const reviewInput = document.getElementById("review");
  const anonInput = document.getElementById("isAnonymous");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const reviewText = reviewInput.value.trim();
      const overallRating = Number(
        document.querySelector('input[name="overallRating"]:checked')?.value
      );
      const difficultyRating = Number(
        document.querySelector('input[name="difficultyRating"]:checked')?.value
      );
      const isAnonymous = anonInput.checked;

      // Basic presence check
      if (
        !reviewText ||
        isNaN(overallRating) ||
        isNaN(difficultyRating)
      ) {
        throw new Error("All fields (review and both ratings) are required");
      }

      // Range checks
      if (overallRating < 1 || overallRating > 5) {
        throw new Error("Overall rating must be between 1 and 5");
      }
      if (difficultyRating < 1 || difficultyRating > 3) {
        throw new Error("Difficulty rating must be between 1 and 3");
      }

      form.submit();
    } catch (err) {
      showToast("error", err.message);
    }
  });
});

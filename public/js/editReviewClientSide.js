document.addEventListener("DOMContentLoaded", function () {
    function showToast(type, msg) {
        Toastify({
            close: true,
            text: msg,
            duration: 4000,
            gravity: "top",      // top | bottom
            position: "right",   // left | center | right
            style: { background: type === "error" ? "#dc2626" : "#16a34a" },
        }).showToast();
    }
    // Get the input elements with value
    const reviewTextInput = document.getElementById("reviewText").value;
    const overallRatingInput = document.getElementById("overallRating").value;
    const DifficultyInput = document.getElementById("difficulty").value;
    const addReviewForm = document.getElementById("addReviewForm");
   
    
  
    if (!addReviewForm) {
        console.error("Add Review Form not found");
        return;
    }
    addReviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        try {
            // Retrieve and trim all the input values
            const reviewText = reviewTextInput.value.trim();
            const overallRating = Number(overallRatingInput.value);
            const difficultyRating = Number(DifficultyInput.value);

            if(!reviewText || !overallRating || !difficultyRating) {
                throw new Error("All values are required");
            }
            // Validate required fields
            if (!reviewText || isNaN(overallRating) || isNaN(difficultyRating)) {
                throw new Error("All fields are required");
            }

            // Validate individual fields
            if (typeof reviewText !== "string") {
                throw new Error("Review must be a string");
            }
            if(reviewText.length === 0) {
                throw new Error("Review cannot be empty");
            }
            if (typeof overallRating !== "number" || typeof difficultyRating !== "number") {
                throw new Error("Overall rating and difficulty rating must be numbers");
            }


            if (overallRating < 1 || overallRating > 5) {
                throw new Error("Overall rating must be between 1 and 5");
            }
            if (difficultyRating < 1 || difficultyRating > 3) {
                throw new Error("Difficulty rating must be between 1 and 3");
            }
            addReviewForm.submit();
           
        } catch (error) {
            showToast("error", error.message);
        }
        
        
    });
});
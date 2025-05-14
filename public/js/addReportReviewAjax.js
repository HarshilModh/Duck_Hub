


document.addEventListener("DOMContentLoaded", function () { 
    console.log("DOM fully loaded and parsed");
    
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
    const reportReviewForm = document.getElementById("reportReviewForm");
    const reportReviewButton = document.getElementById("reportReviewButton");
    const reasonInput = document.getElementById("reason");
  
    reportReviewForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
     try{ 
        const formData = new FormData(reportReviewForm);
        const reason = reasonInput.value.trim();
    
        // Validate the reason input
        if (reason.length === 0) {
            throw new Error("Reason cannot be empty");
        }

        reportReviewForm.submit(); // Submit the form if validation passes
    }
    catch (error) {
        showToast("error", + error);  
    }
    });

        
    });
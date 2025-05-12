{/* <div class="mt-4">
  <form
    action="/report/Review"
    method="POST"
    class="flex items-center space-x-2"
    id="reportReviewForm"
  >
    <input type="hidden" name="contentId" value="{{this.review._id}}" />
    <input type="hidden" name="userId" value="{{userId}}" />
  
    <input
      type="text"
      name="reason"
      placeholder="Reason for reporting…"
      id="reason"
      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stevensMaroon focus:border-stevensMaroon"
    />

    <button
      type="submit"
      id="reportReviewButton"
      class="bg-red-600 text-stevensWhite px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Report
    </button>
  </form>
</div> */}

    //add toast message to the top of the page


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
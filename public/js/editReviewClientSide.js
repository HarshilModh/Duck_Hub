// // public/js/editReviewClientSide.js

// {{!-- views/editReview.handlebars --}}

// <div class="max-w-md mx-auto bg-stevensWhite rounded-2xl shadow-lg p-8">
//   <h2 class="text-2xl font-heading text-stevensMaroon mb-6">Edit Review</h2>

//   <form action="/userSideCourses/editReview/{{review._id}}" id="editCourseReviewForm" method="POST" class="space-y-6">

//     <!-- Course Info -->
//     <div>
//       <p class="text-gray-500 text-sm mb-1">Course</p>
//       <p class="font-medium text-gray-800">
//         {{review.courseId.courseCode}} &mdash; {{review.courseId.courseName}}
//       </p>
//     </div>

//     <!-- Overall Rating -->
//     <div>
//       <label class="block text-stevensGray font-medium mb-2">Overall Rating</label>
//       <div class="flex space-x-2">
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="overallRating"
//             value="1"
//             class="peer sr-only"
//             {{#if (eq review.overallRating 1)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="overallRating"
//             value="2"
//             class="peer sr-only"
//             {{#if (eq review.overallRating 2)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="overallRating"   
//             value="3"
//             class="peer sr-only"
//             {{#if (eq review.overallRating 3)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="overallRating"
//             value="4"
//             class="peer sr-only"
//             {{#if (eq review.overallRating 4)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="overallRating"
//             value="5"
//             class="peer sr-only"
//             {{#if (eq review.overallRating 5)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//       </div>
//     </div>

//     <!-- Difficulty Rating -->
//     <div>
//       <label class="block text-stevensGray font-medium mb-2">Difficulty</label>
//       <div class="flex space-x-2">
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="difficultyRating"
//             value="1"
//             class="peer sr-only"
//             {{#if (eq review.difficultyRating 1)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="difficultyRating"
//             value="2"
//             class="peer sr-only"
//             {{#if (eq review.difficultyRating 2)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//         <label class="cursor-pointer">
//           <input
//             type="radio"
//             name="difficultyRating"
//             value="3"
//             class="peer sr-only"
//             {{#if (eq review.difficultyRating 3)}}checked{{/if}}
//           />
//           <span class="text-3xl text-gray-300 peer-checked:text-stevensMaroon peer-hover:text-stevensMaroon transition">
//             ★
//           </span>
//         </label>
//       </div>
//     </div>

//     <!-- Review Text -->
//     <div>
//       <label for="review" id="review" class="block text-stevensGray font-medium mb-2">Review</label>
//       <textarea
//         id="review"
//         name="review"
//         rows="4"
//         class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-stevensMaroon"
//       >{{review.review}}</textarea>
//     </div>

//     <!-- Actions -->
//     <div class="flex justify-end space-x-4">
//       <a
//         href="/userSideCourses/course/{{review.courseId._id}}"
//         class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//       >
//         Cancel
//       </a>
//       <button
//         type="submit"
//         class="bg-stevensMaroon text-stevensWhite px-4 py-2 rounded-lg hover:bg-stevensMaroon/90 transition"
//       >
//         Update Review
//       </button>
//     </div>
//   </form>
// </div>
// <script src="/js/editReviewClientSide.js"></script>

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
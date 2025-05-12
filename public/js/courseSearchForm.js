// {{!-- views/courses.handlebars --}}
// <div class="container mx-auto px-4 py-8">

//   <!-- Page Title -->
//   <h1 class="font-heading text-4xl text-stevensMaroon mb-6">Courses</h1>

//   <!-- ========== SEARCH FORM ========== -->
//   <div class="mb-8">
//     <form action="/userSideCourses/searchCourses" method="POST" class="max-w-md mx-auto flex">
//       <label for="search" class="sr-only">Search courses</label>
//       <input
//         type="text"
//         name="search"
//         id="search"
//         value="{{search}}"
//         placeholder="Search by course name or code…"
//         class="flex-1 px-4 py-2 border border-stevensGray rounded-l-lg focus:ring-2 focus:ring-stevensMaroon"
//       />
//       <button
//         type="submit"
//         class="bg-stevensMaroon text-stevensWhite px-6 rounded-r-lg hover:bg-stevensMaroon/90 transition"
//       >
//         Search
//       </button>
//     </form>
//   </div>

//   <!-- ========== FILTER FORM ========== -->
//   <div class="bg-stevensWhite rounded-2xl shadow p-6 mb-8">
//     <form
//       action="/userSideCourses/filterCoursesCombined"
//       method="POST"
//       class="grid grid-cols-1 lg:grid-cols-4 gap-4"
//     >
//       <!-- Difficulty -->
//       <div class="flex flex-col">
//         <label class="text-stevensGray mb-1">Difficulty</label>
//         <div class="flex items-center gap-2">
//           <input
//             name="minDifficultyRating"
//             type="number" min="1" max="3"
//             placeholder="Min"
//             class="w-full px-2 py-1 border border-stevensGray rounded-lg focus:ring-stevensMaroon"
//           />
//           <span class="text-stevensGray">–</span>
//           <input
//             name="maxDifficultyRating"
//             type="number" min="1" max="3"
//             placeholder="Max"
//             class="w-full px-2 py-1 border border-stevensGray rounded-lg focus:ring-stevensMaroon"
//           />
//         </div>
//       </div>

//       <!-- Avg. Rating -->
//       <div class="flex flex-col">
//         <label class="text-stevensGray mb-1">Avg. Rating</label>
//         <div class="flex items-center gap-2">
//           <input
//             name="minAverageRating"
//             type="number" step="0.1" min="0" max="5"
//             placeholder="Min"
//             class="w-full px-2 py-1 border border-stevensGray rounded-lg focus:ring-stevensMaroon"
//           />
//           <span class="text-stevensGray">–</span>
//           <input
//             name="maxAverageRating"
//             type="number" step="0.1" min="0" max="5"
//             placeholder="Max"
//             class="w-full px-2 py-1 border border-stevensGray rounded-lg focus:ring-stevensMaroon"
//           />
//         </div>
//       </div>

//       <!-- Department -->
//       <div class="flex flex-col">
//         <label class="text-stevensGray mb-1">Department</label>
//         <select
//           name="departmentId"
//           class="px-3 py-2 border border-stevensGray rounded-lg focus:ring-stevensMaroon"
//         >
//           <option value="" selected>All departments</option>
//           {{#each departments}}
//             <option value="{{this.departmentId}}">{{this.departmentName}}</option>
//           {{/each}}
//         </select>
//       </div>

//       <!-- Apply & Reset -->
//       <div class="flex items-end gap-2">
//         <button
//           type="submit"
//           class="bg-stevensMaroon text-stevensWhite px-6 py-2 rounded-lg hover:bg-stevensMaroon/90 transition w-full"
//         >
//           Apply
//         </button>
//         <a
//           href="/userSideCourses"
//           class="bg-stevensGray text-stevensWhite px-6 py-2 rounded-lg hover:bg-stevensGray/90 transition w-full text-center"
//         >
//           Reset
//         </a>
//       </div>
//     </form>
//   </div>

//   <!-- ========== RESULTS ========== -->
//   <h2 class="font-heading text-2xl text-stevensMaroon mb-4">
//     {{#if filtered}}Filtered Courses{{else}}All Courses{{/if}}
//   </h2>

//   {{#if courses.length}}
//     <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {{#each courses}}
//         <div class="relative bg-stevensWhite rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-200">
//           <a href="/userSideCourses/course/{{this._id}}" class="block p-6 flex flex-col h-full">
//             <p class="font-heading text-stevensMaroon text-lg mb-2">{{this.courseCode}}</p>
//             <h3 class="font-semibold text-gray-800 text-xl mb-3 capitalize">{{this.courseName}}</h3>
//             <p class="text-stevensGray text-sm flex-1 line-clamp-4">{{this.courseDescription}}</p>
//           </a>
//           {{#if ../user}}
//             {{#if (eq ../user.role "admin")}}
//               <div class="absolute bottom-4 right-4 flex space-x-2">
//                 <a
//                   href="/courses/{{this._id}}"
//                   class="bg-stevensMaroon text-stevensWhite px-3 py-1 rounded-lg text-sm hover:bg-stevensMaroon/90 transition"
//                 >
//                   Edit
//                 </a>
//                 <form action="/courses/{{this._id}}" method="POST" onsubmit="return confirm('Delete “{{this.courseName}}”?');">
//                   <input type="hidden" name="_method" value="DELETE" />
//                   <button
//                     type="submit"
//                     class="bg-red-600 text-stevensWhite px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
//                   >
//                     Delete
//                   </button>
//                 </form>
//               </div>
//             {{/if}}
//           {{/if}}
//         </div>
//       {{/each}}
//     </div>
//   {{else}}
//     <p class="text-center italic text-stevensGray">No courses found.</p>
//   {{/if}}

// </div>

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
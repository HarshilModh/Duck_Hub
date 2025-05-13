// {{!-- views/createCategoryForAcademicResource.handlebars --}}

// <div class="min-h-screen bg-stevensBg font-body text-stevensMaroon px-4 py-12">
//   <div class="max-w-4xl mx-auto bg-stevensWhite rounded-2xl shadow p-8">
//     <h2 class="text-3xl font-heading mb-6">Create Academic Resource Category</h2>

//     <form action="/resCategory/create" method="POST" class="space-y-6">
//       <div>
//         <label for="categoryName" class="block text-stevensGray font-medium mb-2">
//           Category Name
//         </label>
//         <input
//           type="text"
//           id="categoryName"
//           name="categoryName"
//           required
//           placeholder="Enter new category"
//           class="w-full px-4 py-2 border border-stevensGray rounded-lg focus:outline-none focus:ring-2 focus:ring-stevensMaroon"
//         />
//       </div>

//       <div class="flex justify-end space-x-4">
//         <a
//           href="/academicResources"
//           class="px-4 py-2 border border-stevensMaroon text-stevensMaroon rounded-lg hover:bg-stevensMaroon hover:text-stevensWhite transition"
//         >
//           Cancel
//         </a>
//         <button
//           type="submit"
//           class="bg-stevensMaroon text-stevensWhite px-6 py-2 rounded-lg hover:bg-stevensMaroon/90 transition"
//         >
//           Create Category
//         </button>
//       </div>
//     </form>
//   </div>
// </div>

document.addEventListener("DOMContentLoaded", function () {
    function showToast(type, msg) {
        Toastify({
            text: msg,
            duration: 2000,
            gravity: "top",
            position: "right",  
            close: true,
            style: { background: type === "error" ? "#dc2626" : "#16a34a" },
        }).showToast();
    }
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const categoryName = document.getElementById("categoryName").value.trim();
        try {
            if (!categoryName) {
                throw new Error("Please fill in all fields");
            }
            if(categoryName.trim().length==0){
                throw new Error("Category name cannot be empty");
            }
            if (!isValidString(categoryName)) {
                throw new Error("Category name contains invalid characters");
            }
            form.submit();
        } catch (error) {
            showToast("error", error.message);
        }
    
    });
});
function isValidString(str) {
    const regex = /^[a-zA-Z0-9\s]+$/; // Allow letters, numbers, and spaces
    return regex.test(str);
}
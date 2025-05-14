
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
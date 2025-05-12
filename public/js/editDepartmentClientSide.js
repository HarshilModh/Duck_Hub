document.addEventListener("DOMContentLoaded", function () {
    function showToast(type, msg) {
        Toastify({
            //add close button
            close: true,
            text: msg,
            duration: 4000,
            gravity: "top",      // top | bottom
            position: "right",   // left | center | right
            style: { background: type === "error" ? "#dc2626" : "#16a34a" }
        }).showToast();
    }
    const departmentForm = document.getElementById("editDepartmentForm");
    const departmentNameInput = document.getElementById("departmentName");

    if (!departmentForm) {
        console.error("Department form not found");
        return;
    }
    departmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const departmentName = departmentNameInput.value.trim();

        function isValidString(str) {
            const regex = /^[a-zA-Z0-9\s]+$/; // Adjust the regex as needed
            return regex.test(str);
        }
        try {
            if (!departmentName) {
                throw new Error("Department name cannot be empty");
            }
            if (departmentName.length === 0) {
                throw new Error("Department name cannot be empty");
            }
            if (!isValidString(departmentName)) {
                throw new Error("Department name can only contain letters, numbers, and spaces");
            }
            departmentForm.submit();
        }
        catch (error) {
            showToast("error", error.message);
            return;
        }
        // If validation passes, submit the form
        departmentForm.submit();
    });
});
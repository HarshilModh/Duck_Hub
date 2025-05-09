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
    const requestForm = document.getElementById("requestForm");
    const requestTypeInput = document.getElementById("itemType");
    const requestNameInput = document.getElementById("itemName");
    const descriptionInput = document.getElementById("description");
    
    if (!requestForm) {
        console.error("Request Form not found");
        return;
    }
    requestForm.addEventListener("submit", function (event) {
        event.preventDefault();
        try {
            // Retrieve and trim all the input values
            const requestName = requestNameInput.value.trim();
            const requestType = requestTypeInput.value.trim();
            const description = descriptionInput.value.trim();

            // Validate required fields
            if (!requestName || !requestType || !description) {
                throw new Error("Please fill in all fields");
            }

            // Validate individual fields
            if (typeof requestName !== "string" || typeof requestType !== "string" || typeof description !== "string") {
                throw new Error("Request Name, Request Type, and Description must be strings");
            }
            if(requestName.length === 0) {
                throw new Error("Request Name cannot be empty");
            }
            if(requestType.length === 0) {
                throw new Error("Request Type cannot be empty");
            }
            if(description.length === 0) {
                throw new Error("Description cannot be empty");
            }
            if (requestType !== "Course" && requestType !== "Department" && requestType !== "Other") {
                throw new Error("Request Type must be either Course, Department, or Other");
            }
            requestForm.submit();
           
        } catch (error) {
            showToast("error", error.message);
        }
    });
}
);
document.addEventListener("DOMContentLoaded", function () {
    console.log("Add Course Page Loaded");
    
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
    const courseForm = document.getElementById("editCourseForm");
    const courseCodeInput = document.getElementById("courseCode");
    const courseNameInput = document.getElementById("courseName");
    const courseDescriptionInput = document.getElementById("courseDescription");
    const courseDepartmentInput = document.getElementById("departmentId");

    if (!courseForm) {
        return;
    }

    courseForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const courseCode = courseCodeInput.value.trim();
        const courseName = courseNameInput.value.trim();
        const courseDescription = courseDescriptionInput.value.trim();
        const courseDepartment = courseDepartmentInput.value;

        function isValidString(str) {
            const regex = /^[a-zA-Z0-9\s]+$/; // Adjust the regex as needed
            return regex.test(str);
        }
        try {
            if(!courseCode||!courseName||!courseDescription||!courseDepartment) {
                throw new Error("All fields are required");
            }
            if (!courseCode) {
                throw new Error("Course code cannot be empty");
            }
            if (courseCode.length === 0) {
                throw new Error("Course code cannot be empty");
            }
            if (!isValidString(courseCode)) {
                throw new Error("Course code can only contain letters, numbers, and spaces");
            }
            if (!courseName) {
                throw new Error("Course name cannot be empty");
            }
            if (courseName.length === 0) {
                throw new Error("Course name cannot be empty");
            }
            if (!isValidString(courseName)) {
                throw new Error("Course name can only contain letters, numbers, and spaces");
            }
            if (!courseDescription) {
                throw new Error("Course description cannot be empty");
            }
            if (courseDescription.length === 0) {
                throw new Error("Course description cannot be empty");
            }
            if (!isValidString(courseDescription)) {
                throw new Error("Course description can only contain letters, numbers, and spaces");
            }
            const validCoruseCodeRegex = /^[A-Z]{2,4}\d{3}$/; // Example: CS101, MATH202
            if (!validCoruseCodeRegex.test(courseCode)) {
                throw new Error("Course code must be in the format of 2-4 uppercase letters followed by 3 digits (e.g., CS101)");
            }
            if (!courseDepartment) {
                throw new Error("Please select a department");
            }
            if (courseDepartment === "0") {
                throw new Error("Please select a valid department");
            }
            if (courseDepartment.length === 0) {
                throw new Error("Please select a department");
            }
        } catch (error) {
            showToast("error", error.message);
            return;
        }

        // If validation passes, submit the form
        courseForm.submit();    
    });
    });
document.addEventListener("DOMContentLoaded", function () {
        const campusResourceForm = document.getElementById("editCampusResourceForm");
        const resourceTypeInput = document.getElementById("resourceType");
        const resourceNameInput = document.getElementById("resourceName");
        const descriptionInput = document.getElementById("description");
        const latitudeInput = document.getElementById("latVal");
        const longitudeInput = document.getElementById("lngVal");
        const emailInput = document.getElementById("contactEmail");
        const contactNumberInput = document.getElementById("contactNumber");
        const operatingHoursInput = document.getElementById("operatingHours");
      
        // Function to display toast messages
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
      
        if (!campusResourceForm) {
          console.error("Campus Resource Form not found");
          return;
        }
      
        campusResourceForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          try {
            // Retrieve and trim all the input values
            const resourceName = resourceNameInput.value.trim();
            const resourceType = resourceTypeInput.value.trim();
            const description = descriptionInput.value.trim();
            const location = {
              type: "Point",
              coordinates: [parseFloat(longitudeInput.value), parseFloat(latitudeInput.value)],
            };
            const contactDetails = {
              email: emailInput.value.trim(),
              contactNumber: contactNumberInput.value.trim(),
            };
            const operatingHours = operatingHoursInput.value.split(",").map((hour) => hour.trim());
      
            // Validate required fields
            if (!resourceName || !resourceType || !description || !contactDetails.email || !contactDetails.contactNumber) {
              throw new Error("All fields are required");
            }
      
            // Validate individual fields
            if(typeof resourceName !== "string" || typeof resourceType !== "string" || typeof description !== "string") {
              throw new Error("Resource Name, Resource Type, and Description must be strings");
            }
            if (typeof contactDetails.email !== "string" || typeof contactDetails.contactNumber !== "string") {
              throw new Error("Contact Email and Contact Number must be strings");
            }
            if (resourceName.length === 0) {
              throw new Error("Resource Name cannot be empty");
            }
            if (resourceType.length === 0) {
              throw new Error("Resource Type cannot be empty");
            }
            if (description.length === 0) {
              throw new Error("Description cannot be empty");
            }
            if (!Array.isArray(operatingHours) || operatingHours.length === 0) {
              throw new Error("Operating Hours cannot be empty");
            }
      
          //operating hours validation
          const regexforhours = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun):\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/;
          // Check if each operating hours string matches the regex
            for (let i = 0; i < operatingHours.length; i++) {
                if (typeof operatingHours[i] !== "string") {
                throw new Error("Operating hours must be a string");
                }
                // Check if the string is empty
                if (operatingHours[i].trim() === "") {
                throw new Error("Operating hours must not be empty");
                }
                // Check if the string is too long
                if (operatingHours[i].length > 50) {
                throw new Error("Operating hours must not be more than 50 characters");
                }
                // Check if the string is too short
                if (operatingHours[i].length < 5) {
                throw new Error("Operating hours must be at least 5 characters");
                }
                // Check if the string matches the regex
                if (!regexforhours.test(operatingHours[i])) {
                throw new Error(`Invalid operating hours format: ${operatingHours[i]}`);
                }
            }
            // Validate location
            if (!location || !location.type || !location.coordinates) {
              throw new Error("Location must have type and coordinates");
            }
            if (location.type !== "Point") {
              throw new Error("Location type must be 'Point'");
            }
            if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
              throw new Error("Coordinates must be an array of [longitude, latitude]");
            }
            if (typeof location.coordinates[0] !== "number" || typeof location.coordinates[1] !== "number") {
              throw new Error("Coordinates must be numbers");
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactDetails.email)) {
              throw new Error("Invalid email format");
            }
            const contactNumberRegex = /^\d{10}$/; // Assuming contact number should be 10 digits
            if (!contactNumberRegex.test(contactDetails.contactNumber)) {
              throw new Error("Invalid contact number format");
            }
            campusResourceForm.submit();
      
          } catch (error) {
            console.error("Error creating campus resource:", error);
            showToast("error", error.message);
          }
        });
      });
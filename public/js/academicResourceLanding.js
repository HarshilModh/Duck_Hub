(function () {
  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const resourceId = button.getAttribute("data-id");
      if (!resourceId) {
        throw new Error("Button has no resourceId");
      }
      const res = await fetch(`/academicResources/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        location.reload();
      } else {
        throw new Error(newTag.error || "Something went wrong.");
      }
    });
  });
})();

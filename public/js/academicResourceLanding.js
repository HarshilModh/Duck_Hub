(function () {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const reportButtons = document.querySelectorAll(".report-button");
  let userId = document.getElementById("userId");

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
        window.location.reload();
      } else {
        throw new Error(newTag.error || "Something went wrong.");
      }
    });
  });

  reportButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const contentId = button.getAttribute("data-id");
      if (!contentId) {
        throw new Error("Button has no contentId");
      }

      window.location.href = `/report/create/academicResource/${contentId}`;
    });
  });
})();

(function () {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const reportButtons = document.querySelectorAll(".report-button");
  const userId = document.getElementById("userId");

  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");
  const reportContentIdInput = document.getElementById("reportContentId");
  const reportCancelBtn = document.getElementById("reportCancel");

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
    button.addEventListener("click", (e) => {
      const contentId = e.currentTarget.dataset.id;
      reportContentIdInput.value = contentId;
      reportModal.style.display = "flex";
    });
  });

  reportCancelBtn.addEventListener("click", () => {
    reportModal.style.display = "none";
    reportForm.reset();
  });

  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = "none";
      reportForm.reset();
    }
  });
})();

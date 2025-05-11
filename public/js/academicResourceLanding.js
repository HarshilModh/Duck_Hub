(function () {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const reportButtons = document.querySelectorAll(".report-button");
  const upvoteButtons = document.querySelectorAll(".upvote-button");
  const downvoteButtons = document.querySelectorAll(".downvote-button");

  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");
  const reportContentIdInput = document.getElementById("reportContentId");
  const reportCancelBtn = document.getElementById("reportCancel");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const resourceId = button.dataset.id;
      if (!resourceId) throw new Error("Button has no resourceId");
      const res = await fetch(`/academicResources/${resourceId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) window.location.reload();
      else throw new Error("Something went wrong.");
    });
  });

  reportButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      reportContentIdInput.value = e.currentTarget.dataset.id;
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

  upvoteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const academicResourceId = e.currentTarget.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");
      try {
        const response = await fetch(
          `/academicResources/upvote/${academicResourceId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUserId }),
          }
        );
        if (response.ok || response.status === 400) window.location.reload();
        else {
          const { error } = await response.json();
          alert(error);
        }
      } catch (err) {
        console.error("Error while upvoting:", err);
      }
    });
  });

  downvoteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const academicResourceId = e.currentTarget.dataset.id;
      if (!loggedInUserId) return alert("Please log in to vote.");
      try {
        const response = await fetch(
          `/academicResources/downvote/${academicResourceId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUserId }),
          }
        );
        if (response.ok || response.status === 400) window.location.reload();
        else {
          const { error } = await response.json();
          alert(error);
        }
      } catch (err) {
        console.error("Error while downvoting:", err);
      }
    });
  });

  // ============================
  // TAG CREATION MODAL HANDLING
  // ============================
  const openTagModalBtn = document.getElementById("openTagModal");
  const tagModal = document.getElementById("tagModal");
  const tagCancelBtn = document.getElementById("tagCancel");
  const tagForm = document.getElementById("tagForm");
  const tagNameInput = document.getElementById("tagName");

  // Inline error element
  const tagError = document.createElement("p");
  tagError.id = "tagError";
  tagError.style.color = "red";
  tagError.style.marginTop = "0.25rem";

  // Open modal
  openTagModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    tagError.remove();
    tagForm.reset();
    tagModal.style.display = "flex";
  });

  // Cancel modal
  tagCancelBtn.addEventListener("click", () => {
    tagModal.style.display = "none";
    tagForm.reset();
    tagError.remove();
  });

  // Close by clicking outside
  tagModal.addEventListener("click", (e) => {
    if (e.target === tagModal) {
      tagModal.style.display = "none";
      tagForm.reset();
      tagError.remove();
    }
  });

  // Validate & submit
  tagForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = tagNameInput.value.trim();
    if (!name) {
      if (
        !tagNameInput.nextElementSibling ||
        tagNameInput.nextElementSibling.id !== "tagError"
      ) {
        tagNameInput.insertAdjacentElement("afterend", tagError);
      }
      tagError.textContent = "Tag name cannot be empty or just spaces.";
      return;
    }
    tagError.remove();
    tagForm.submit();
  });
})();

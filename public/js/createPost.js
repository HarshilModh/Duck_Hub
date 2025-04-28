const createForumBtn = document.getElementById("createForumBtn");
const createPollBtn = document.getElementById("createPollBtn");
const forumFormContainer = document.getElementById("forumFormContainer");
const pollFormContainer = document.getElementById("pollFormContainer");
const forumForm = document.getElementById("forumForm");

createForumBtn.addEventListener("click", () => {
  forumFormContainer.style.display = "block";
  pollFormContainer.style.display = "none";
});

createPollBtn.addEventListener("click", () => {
  forumFormContainer.style.display = "none";
  pollFormContainer.style.display = "block";
});

forumForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop default submit behavior

  const formData = new FormData(forumForm);

  try {
    const response = await fetch("/forums", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong.");
    }

    alert("Forum post created successfully!");
    window.location.href = "/forums";
  } catch (err) {
    console.error("Error submitting forum:", err);
    alert(err.message || "Failed to create forum.");
  }
});

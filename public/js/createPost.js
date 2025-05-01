const createForumBtn = document.getElementById("createForumBtn");
const createPollBtn = document.getElementById("createPollBtn");
const forumFormContainer = document.getElementById("forumFormContainer");
const pollFormContainer = document.getElementById("pollFormContainer");
const forumForm = document.getElementById("forumForm");
const addNewTagBtn = document.getElementById("addTagBtn");
const newTagDiv = document.getElementById("newTagDiv");
const saveTagBtn = document.getElementById("saveNewTag");

createForumBtn.addEventListener("click", () => {
  forumFormContainer.style.display = "block";
  pollFormContainer.style.display = "none";
});

createPollBtn.addEventListener("click", () => {
  forumFormContainer.style.display = "none";
  pollFormContainer.style.display = "block";
});

addNewTagBtn.addEventListener("click", () => {
  newTagDiv.style.display = "block";
});

saveTagBtn.addEventListener("click", async () => {
  const tagValue = newTagName.value.trim().toUpperCase();
  const userIdValue = userId.value;

  if (!tagValue) {
    throw new Error("Tag name can't be empty");
  }

  if (!userIdValue) {
    throw new Error("Cannot create a tag with logging in");
  }

  const res = await fetch("/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: tagValue, userId: userIdValue }),
  });

  const newTag = res.json();
  if (res.ok) {
    location.reload();
  } else {
    throw new Error(newTag.error || "Something went wrong.");
  }
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

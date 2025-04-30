(function () {
  let newTagDiv = document.getElementById("newTagModal");
  let newTagBtn = document.getElementById("addTagBtn");
  let saveTagBtn = document.getElementById("saveNewTag");
  let newTagName = document.getElementById("newTagName");
  let userId = document.getElementById("userId");

  if (newTagBtn) {
    newTagBtn.addEventListener("click", () => {
      newTagDiv.style.display = "block";
    });
  }

  if (saveTagBtn) {
    saveTagBtn.addEventListener("click", async () => {
      const tagValue = newTagName.value.trim().toUpperCase();
      const userIdValue = userId.value;

      if (!tagValue) {
        throw new Error("Tag name can't be empty");
      }

      if (!userIdValue) {
        throw new Error("Cannot create a tag with logging in");
      }

      const res = await fetch(`/tags`, {
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
  }
})();

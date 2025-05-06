(function () {
  const newTagDiv = document.getElementById("newTagModal");
  const newTagBtn = document.getElementById("addTagBtn");
  const saveTagBtn = document.getElementById("saveNewTag");
  const newTagName = document.getElementById("newTagName");
  const userId = document.getElementById("userId");
  const forumSelect = document.getElementById("tags");

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
      try {
        const res = await fetch("/tags", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tagValue, userId: userIdValue }),
        });

        const newTag = await res.json();
        if (!res.ok) {
          throw new Error(newTag.error || "Failed to create tag");
        }

        [forumSelect].forEach((selectEl) => {
          const opt = document.createElement("option");
          opt.value = newTag._id;
          opt.textContent = newTag.name;
          opt.selected = true;
          selectEl.appendChild(opt);
        });

        newTagName.value = "";
        newTagDiv.style.display = "none";
      } catch (err) {}
      console.error("Error creating tag:", err);
      alert("Error creating tag: " + err.message);
    });
  }
})();

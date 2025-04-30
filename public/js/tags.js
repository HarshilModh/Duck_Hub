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
      newTagName = newTagName.value.trim();

      if (!newTagName) {
        console.log("Tag name can't be empty");
        return;
      }

      newTagName = newTagName.toUpperCase();

      if (!userId) {
        console.log("Cannot create a tag with logging in");
        return;
      }

      userId = userId.value;

      const res = await fetch(`/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTagName, userId: userId }),
      });

      const tag = await res.json();
      if (res.ok) {
        const select = document.getElementById("tags");
        const newOption = document.createElement("option");
        newOption.value = tag._id;
        newOption.text = tag.name;
        newOption.selected = true;
        select.appendChild(newOption);
        document.getElementById("newTagModal").style.display = "none";
        document.getElementById("newTagName").value = "";
      } else {
        console.log(tag.error || "Failed to create tag");
        return;
      }
    });
  }
})();

(function () {
  let newTagDiv = document.getElementById("newTagModal");
  let newTagBtn = document.getElementById("addTagBtn");
  let saveTagBtn = document.getElementById("saveNewTag");
  let newTagName = document.getElementById("newTagName");

  if (newTagBtn) {
    newTagBtn.addEventListener("click", () => {
      newTagDiv.style.display = "block";
    });
  }

  if (saveTagBtn) {
    saveTagBtn.addEventListener("click", async () => {
      newTagName = newTagName.value.trim();

      if (!newTagName) return alert("Tag name can't be empty");

      const res = await fetch("/tags/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName, userId: "{{loggedUserId}}" }),
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
        alert(tag.error || "Failed to create tag");
      }
    });
  }
})();

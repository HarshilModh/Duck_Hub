// public/js/createAcademicResource.js
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTS ===
    const tagInput       = document.getElementById('tagInput');
    const suggestions    = document.getElementById('tagSuggestions');
    const selectedDiv    = document.getElementById('selectedTags');
    const newTagDiv      = document.getElementById('newTagModal');
    const newTagBtn      = document.getElementById('addTagBtn');
    const saveTagBtn     = document.getElementById('saveNewTag');
    const newTagNameInput= document.getElementById('newTagName');
    const userIdInput    = document.getElementById('userId');
    
    // preloaded in your template:
    // <script>const AVAILABLE_TAGS = {{{JSON.stringify(tags.map(t => ({ id: t._id, name: t.name })))}}};</script>
    let selectedTags = [];  // { id, name }

    // === HELPERS ===
    function debounce(fn, ms = 200) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
      };
    }

    function renderSelectedTags() {
      selectedDiv.innerHTML = selectedTags.map(t => `
        <span class="tag-pill">
          ${t.name}
          <button type="button" class="remove-tag" data-id="${t.id}">&times;</button>
          <input type="hidden" name="tags" value="${t.id}">
        </span>
      `).join('');
      bindRemoveClicks();
    }

    function bindRemoveClicks() {
      selectedDiv.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          selectedTags = selectedTags.filter(t => t.id !== id);
          renderSelectedTags();
        });
      });
    }

    function bindSuggestionClicks() {
      suggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const id   = item.dataset.id;
          const name = item.textContent;
          if (!selectedTags.some(t => t.id === id)) {
            selectedTags.push({ id, name });
            renderSelectedTags();
          }
          tagInput.value = '';
          suggestions.innerHTML = '';
        });
      });
    }

    // === TYPEAHEAD LOGIC ===
    const showSuggestions = debounce(() => {
      const q = tagInput.value.trim().toLowerCase();
      if (!q) {
        suggestions.innerHTML = '';
        return;
      }
      const matches = AVAILABLE_TAGS
        .filter(t => t.name.toLowerCase().includes(q))
        .slice(0, 10);
      suggestions.innerHTML = matches
        .map(t => `<div class="suggestion-item" data-id="${t.id}">${t.name}</div>`)
        .join('');
      bindSuggestionClicks();
    });

    tagInput.addEventListener('input', showSuggestions);

    // === ADD NEW TAG MODAL ===
    if (newTagBtn) {
      newTagBtn.addEventListener('click', () => {
        newTagDiv.style.display = 'block';
        newTagNameInput.focus();
      });
    }

    if (saveTagBtn) {
      saveTagBtn.addEventListener('click', async () => {
        const tagValue = newTagNameInput.value.trim().toUpperCase();
        const userId   = userIdInput.value;
        if (!tagValue) {
          return alert("Tag name can't be empty");
        }
        if (!userId) {
          return alert('You must be logged in to create a tag');
        }
        try {
          const res = await fetch('/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: tagValue, userId })
          });
          const newTag = await res.json();
          if (!res.ok) {
            throw new Error(newTag.error || 'Failed to create tag');
          }
          // Add the new tag to our local pool and auto‑select it
          AVAILABLE_TAGS.push({ id: newTag._id, name: newTag.name });
          selectedTags.push({ id: newTag._id, name: newTag.name });
          renderSelectedTags();
          // Reset modal
          newTagNameInput.value = '';
          newTagDiv.style.display = 'none';
        } catch (err) {
          console.error('Error creating tag:', err);
          alert('Error creating tag: ' + err.message);
        }
      });
    }
  });
})();

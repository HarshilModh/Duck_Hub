document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("commentOverlay");
  const closeOverlay = document.getElementById("closeOverlay");
  const postContent = document.getElementById("overlayPostContent");
  const commentsSection = document.getElementById("overlayComments");
  const commentForm = document.getElementById("commentForm");

  document.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const forumId = btn.getAttribute("data-id");
      const postElement = btn.closest(".forum-post-card");

      postContent.innerHTML = postElement.outerHTML;
      document.getElementById("commentForumId").value = forumId;

      try {
        const res = await fetch(`/forums/comments/${forumId}`);
        const comments = await res.json();

        const commentList = document.getElementById("commentList");
        if (Array.isArray(comments) && comments.length > 0) {
          commentList.innerHTML = comments
            .map(
              (comment) => `
              <div class="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <p class="text-sm font-medium text-stevensMaroon mb-1">
                  ${comment.userId.firstName} ${comment.userId.lastName}
                </p>
                <p class="text-sm text-gray-800 mb-2">
                  ${comment.content}
                </p>
                ${
                  comment.imageURLs.length
                    ? `
                  <div class="flex space-x-2 overflow-x-auto pb-2">
                    ${comment.imageURLs
                      .map(
                        (url) => `
                      <img src="${url}" class="h-32 w-auto rounded border flex-shrink-0" />
                    `
                      )
                      .join("")}
                  </div>`
                    : ""
                }
                <p class="text-xs text-gray-500 mt-2">
                  👍 ${comment.upVotes} | 👎 ${comment.downVotes}
                </p>
              </div>
            `
            )
            .join("");
        } else {
          commentList.innerHTML = `<p class="text-sm text-gray-500">No comments yet.</p>`;
        }

        overlay.classList.remove("hidden");
      } catch (err) {
        console.error("Failed to load comments", err);
        document.getElementById(
          "commentList"
        ).innerHTML = `<p class="text-red-500 text-sm">Failed to load comments.</p>`;
        overlay.classList.remove("hidden");
      }
    });
  });

  closeOverlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    postContent.innerHTML = "";
    document.getElementById("commentList").innerHTML = "";
    commentForm.reset();
  });

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const forumId = document.getElementById("commentForumId").value;
    const userId = document.getElementById("commentUserId").value;
    const content = document.getElementById("commentContent").value.trim();
    const imageURL = document.getElementById("commentImage").value.trim();

    const payload = {
      forumId,
      userId,
      content,
      imageURLs: imageURL ? [imageURL] : [],
    };

    try {
      const res = await fetch("/forums/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newComment = await res.json();

        const commentHTML = `
            <div class="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-stevensMaroon mb-1">
                ${newComment.userId.firstName} ${newComment.userId.lastName}
              </p>
              <p class="text-sm text-gray-800 mb-2">${newComment.content}</p>
              ${
                newComment.imageURLs.length
                  ? `
                <div class="flex space-x-2 overflow-x-auto pb-2">
                  ${newComment.imageURLs
                    .map(
                      (url) => `
                    <img src="${url}" class="h-32 w-auto rounded border flex-shrink-0" />
                  `
                    )
                    .join("")}
                </div>`
                  : ""
              }
              <p class="text-xs text-gray-500 mt-2">👍 0 | 👎 0</p>
            </div>
          `;

        document
          .getElementById("commentList")
          .insertAdjacentHTML("afterbegin", commentHTML);
        commentForm.reset();
      } else {
        alert("Failed to post comment.");
      }
    } catch (err) {
      console.error("Error posting comment", err);
    }
  });
});

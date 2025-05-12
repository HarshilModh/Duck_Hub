
$(document).ready(function () {
  const $form   = $("#requestForm");
  const $submit = $form.find("button[type='submit']");  // your “Add” button
  const toastMs = 2000;                                 // toast visible time
  const redirectAfter = "/users/missingRequestUser";    // or read from server

  function showToast(type, msg, ms = toastMs) {
    Toastify({
      text: msg,
      duration: ms,
      gravity: "top",
      position: "right",
      close: true,
      style: { background: type === "error" ? "#dc2626" : "#16a34a" },
    }).showToast();
  }

  $form.on("submit", function (e) {
    e.preventDefault();

    const payload = {
      itemType: $("#itemType").val().trim(),
      itemName: $("#itemName").val().trim(),
      description: $("#description").val().trim(),
    };
    if (!payload.itemType || !payload.itemName || !payload.description) {
      return showToast("error", "Please fill in all fields");
    }

    $submit.prop("disabled", true).addClass("opacity-60 cursor-not-allowed");

    $.ajax({
      type: "POST",
      url: "/users/missingRequest",
      contentType: "application/json",
      data: JSON.stringify(payload),

      success() {
        showToast("success", "Request submitted successfully!");
        setTimeout(() => { window.location.href = redirectAfter; }, toastMs);
      },

      error(jqXHR) {
        const msg =
          jqXHR.responseJSON?.message ||
          "Server error. Please try again later.";
        showToast("error", msg);

        $submit.prop("disabled", false).removeClass("opacity-60 cursor-not-allowed");
      },
    });
  });
});


const forms = document.querySelectorAll(".signup-form");
const openSignupButtons = document.querySelectorAll("[data-open-signup]");
const closeSignup = document.getElementById("close-signup");
const signupModal = document.getElementById("signup-modal");
const backdrop = document.querySelector("[data-close-signup]");
const config = window.SPEAKNSOLVE_CONFIG || {};

forms.forEach((form) => {
  const formNote = form.querySelector(".form-note");
  const submitButton = form.querySelector('button[type="submit"]');
  const submittedAtInput = form.querySelector('input[name="submittedAt"]');

  if (config.formEndpoint) {
    form.action = config.formEndpoint;
  }

  form.addEventListener("submit", () => {
    if (!formNote || !submitButton) {
      return;
    }

    if (submittedAtInput) {
      submittedAtInput.value = new Date().toISOString();
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    formNote.textContent =
      "Submitting your request. Check the Google Sheet and email in a few seconds.";
    formNote.classList.remove("success");

    window.setTimeout(() => {
      const nameField = form.elements.namedItem("name");
      const name =
        nameField && "value" in nameField && typeof nameField.value === "string"
          ? nameField.value.trim() || "there"
          : "there";

      formNote.textContent = `Thanks, ${name}. If the deployment is correct, your request is now in Google Sheets and a notification email has been sent.`;
      formNote.classList.add("success");
      submitButton.disabled = false;
      submitButton.textContent = "Request early access";
      form.reset();

      if (signupModal && !signupModal.hidden && form.classList.contains("modal-form")) {
        window.setTimeout(() => {
          signupModal.hidden = true;
        }, 1200);
      }
    }, 1800);
  });
});

openSignupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (signupModal) {
      signupModal.hidden = false;
    }
  });
});

closeSignup?.addEventListener("click", () => {
  if (signupModal) {
    signupModal.hidden = true;
  }
});

backdrop?.addEventListener("click", () => {
  if (signupModal) {
    signupModal.hidden = true;
  }
});

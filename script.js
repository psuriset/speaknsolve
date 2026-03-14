const chips = document.querySelectorAll(".chip");
const panelStory = document.querySelector(".panel-story h2");
const panelText = document.querySelector(".panel-description");
const form = document.getElementById("pilot-form");
const formNote = document.getElementById("form-note");
const submitButton = form?.querySelector('button[type="submit"]');
const submittedAtInput = document.getElementById("submitted-at");

const interestCopy = {
  Space: {
    title: "Space missions + reasoning + explanation",
    text: "Students solve trajectory, distance, and logic challenges, then explain how they reached the answer like mission presenters.",
  },
  Animals: {
    title: "Animals + observation + confident speaking",
    text: "Use habitats, comparisons, and evidence-based claims to build clear speaking and structured thinking.",
  },
  Sports: {
    title: "Sports stats + math reasoning + confidence",
    text: "Translate scores, probability, and strategy into problem solving that students can explain with energy and clarity.",
  },
  Art: {
    title: "Art + patterns + storytelling",
    text: "Blend visual structure with presentation practice so students learn to describe ideas instead of just making them.",
  },
  Coding: {
    title: "Coding + logic + explanation-first learning",
    text: "Turn debugging into reasoning practice where students must explain the logic behind every fix and decision.",
  },
  Music: {
    title: "Music + structure + verbal fluency",
    text: "Use rhythm and pattern to reinforce sequencing, memory, pacing, and stronger spoken delivery.",
  },
  Robotics: {
    title: "Robotics + systems thinking + articulation",
    text: "Connect build challenges to applied math, step-by-step explanation, and future STEM confidence.",
  },
  Nature: {
    title: "Nature + inquiry + argument building",
    text: "Turn everyday curiosity into hypotheses, evidence, and spoken explanations that make science feel alive.",
  },
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");

    const copy = interestCopy[chip.textContent.trim()];
    if (!copy) {
      return;
    }

    panelStory.textContent = copy.title;
    panelText.textContent = copy.text;
  });
});

form?.addEventListener("submit", (event) => {
  if (!form || !formNote || !submitButton) {
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
  }, 1800);
});

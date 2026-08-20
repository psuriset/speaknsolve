const forms = document.querySelectorAll(".signup-form");
const openSignupButtons = document.querySelectorAll("[data-open-signup]");
const closeSignup = document.getElementById("close-signup");
const signupModal = document.getElementById("signup-modal");
const backdrop = document.querySelector("[data-close-signup]");
const config = window.SPEAKNSOLVE_CONFIG || {};
const openAuthButtons = document.querySelectorAll("[data-open-auth]");
const openParentLoginButtons = document.querySelectorAll("[data-open-parent-login]");
const authModal = document.getElementById("auth-modal");
const closeAuth = document.getElementById("close-auth");
const authBackdrop = document.querySelector("[data-close-auth]");
const googleLoginButton = document.getElementById("google-login-button");
const authNote = document.getElementById("auth-note");
const authProfile = document.getElementById("auth-profile");
const authProfileName = document.getElementById("auth-profile-name");
const authProfileRole = document.getElementById("auth-profile-role");
const parentPortalLink = document.getElementById("parent-portal-link");
const logoutButton = document.getElementById("logout-button");
const openWhatsappButtons = document.querySelectorAll("[data-open-whatsapp]");
const whatsappModal = document.getElementById("whatsapp-modal");
const closeWhatsapp = document.getElementById("close-whatsapp");
const whatsappBackdrop = document.querySelector("[data-close-whatsapp]");
const whatsappForm = document.getElementById("whatsapp-form");
const whatsappNote = document.getElementById("whatsapp-note");
const supportChatPanel = document.getElementById("support-chat-panel");
const supportChatToggle = document.getElementById("support-chat-toggle");
const closeSupportChat = document.getElementById("close-support-chat");
const supportChatMessages = document.getElementById("support-chat-messages");
const supportChatForm = document.getElementById("support-chat-form");
const supportChatInput = document.getElementById("support-chat-input");

const roleLabels = {
  admin: "Admin",
  teacher: "Teacher",
  parent: "Parent",
};

function selectedRole(fieldName) {
  const field = document.querySelector(`input[name="${fieldName}"]:checked`);
  return field && roleLabels[field.value] ? field.value : "parent";
}

function selectAuthRole(role) {
  const field = document.querySelector(`input[name="auth-role"][value="${role}"]`);
  if (field) {
    field.checked = true;
  }
}

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "").trim();
}

function isValidPhone(value) {
  return /^\+?\d{10,15}$/.test(normalizePhone(value));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function googleClientId() {
  const meta = document.querySelector('meta[name="google-signin-client_id"]');
  return (
    config.googleClientId ||
    (meta && meta.content && meta.content.trim()) ||
    localStorage.getItem("speaknsolve_google_client_id") ||
    ""
  );
}

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch (error) {
    console.warn("Unable to decode Google credential payload:", error);
    return {};
  }
}

const AccountStore = {
  getUsers() {
    const users = localStorage.getItem("speaknsolve_users");
    return users ? JSON.parse(users) : {};
  },
  saveUsers(users) {
    localStorage.setItem("speaknsolve_users", JSON.stringify(users));
  },
  current() {
    const id = localStorage.getItem("speaknsolve_current_user");
    if (!id) return null;
    return this.getUsers()[id] || null;
  },
  loginWithGoogle(profile, role) {
    const email = String(profile.email || "").trim().toLowerCase();
    if (!email) {
      return { success: false, error: "Google email is required." };
    }
    const users = this.getUsers();
    const id = `google:${email}:${role}`;
    users[id] = {
      id,
      provider: "google",
      role,
      name: profile.name || email.split("@")[0],
      email,
      updatedAt: new Date().toISOString(),
      createdAt: users[id]?.createdAt || new Date().toISOString(),
    };
    this.saveUsers(users);
    localStorage.setItem("speaknsolve_current_user", id);
    return { success: true, user: users[id] };
  },
  signupWithWhatsapp({ name, phone, grade, role }) {
    const normalizedPhone = normalizePhone(phone);
    if (!name || name.trim().length < 2) {
      return { success: false, error: "Name must be at least 2 characters." };
    }
    if (!isValidPhone(normalizedPhone)) {
      return { success: false, error: "Enter a valid WhatsApp number with country code." };
    }
    const users = this.getUsers();
    const id = `whatsapp:${normalizedPhone}:${role}`;
    users[id] = {
      id,
      provider: "whatsapp",
      role,
      name: name.trim(),
      phone: normalizedPhone,
      grade: grade || "",
      updatedAt: new Date().toISOString(),
      createdAt: users[id]?.createdAt || new Date().toISOString(),
    };
    this.saveUsers(users);
    localStorage.setItem("speaknsolve_current_user", id);
    return { success: true, user: users[id] };
  },
  logout() {
    localStorage.removeItem("speaknsolve_current_user");
  },
};

function updateAuthUi() {
  const user = AccountStore.current();
  const parentPortalUrl = config.parentPortalUrl || "";
  if (authProfileName) {
    authProfileName.textContent = user ? user.name : "Signed in";
  }
  if (authProfileRole) {
    authProfileRole.textContent = user ? `${roleLabels[user.role] || "Parent"} · ${user.provider}` : "Parent";
  }
  if (authProfile) {
    authProfile.hidden = !user;
  }
  if (authNote) {
    authNote.textContent = user
      ? `Signed in as ${user.name} (${roleLabels[user.role] || "Parent"}).${user.role === "parent" && parentPortalUrl ? " Parent portal access is ready." : ""}`
      : "Admin, teacher, and parent accounts are separate role contexts.";
  }
  if (parentPortalLink) {
    const showParentPortal = Boolean(user && user.role === "parent" && parentPortalUrl);
    parentPortalLink.hidden = !showParentPortal;
    if (showParentPortal) {
      parentPortalLink.href = parentPortalUrl;
    }
  }
}

function openAuthModal(role = null) {
  if (role) {
    selectAuthRole(role);
  }
  if (authModal) {
    authModal.hidden = false;
    updateAuthUi();
  }
}

function openParentPortalLogin() {
  openAuthModal("parent");
  if (authNote) {
    authNote.textContent =
      "Parent is selected. Continue with Google using your Gmail account, then open the parent portal.";
  }
}

function closeAuthModal() {
  if (authModal) {
    authModal.hidden = true;
  }
}

function openWhatsappModal() {
  if (whatsappModal) {
    whatsappModal.hidden = false;
  }
}

function closeWhatsappModal() {
  if (whatsappModal) {
    whatsappModal.hidden = true;
  }
}

function handleGoogleCredential(response) {
  const role = selectedRole("auth-role");
  const result = AccountStore.loginWithGoogle(decodeJwtPayload(response.credential || ""), role);
  if (result.success) {
    updateAuthUi();
    closeAuthModal();
  } else if (authNote) {
    authNote.textContent = result.error;
  }
}

function googleFallbackLogin(role) {
  const email = window.prompt("Enter your Google email for local preview mode:");
  if (!email) return;
  const name = window.prompt("Name to show in Speak n Solve:", email.split("@")[0]) || email.split("@")[0];
  const result = AccountStore.loginWithGoogle({ email, name }, role);
  if (result.success) {
    updateAuthUi();
    closeAuthModal();
  } else if (authNote) {
    authNote.textContent = result.error;
  }
}

function startGoogleLogin() {
  const role = selectedRole("auth-role");
  const clientId = googleClientId();
  if (window.google?.accounts?.id && clientId) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredential,
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        googleFallbackLogin(role);
      }
    });
    return;
  }
  googleFallbackLogin(role);
}

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

openAuthButtons.forEach((button) => {
  button.addEventListener("click", () => openAuthModal());
});

openParentLoginButtons.forEach((button) => {
  button.addEventListener("click", openParentPortalLogin);
});

closeAuth?.addEventListener("click", closeAuthModal);
authBackdrop?.addEventListener("click", closeAuthModal);
googleLoginButton?.addEventListener("click", startGoogleLogin);
logoutButton?.addEventListener("click", () => {
  AccountStore.logout();
  updateAuthUi();
});

openWhatsappButtons.forEach((button) => {
  button.addEventListener("click", openWhatsappModal);
});

closeWhatsapp?.addEventListener("click", closeWhatsappModal);
whatsappBackdrop?.addEventListener("click", closeWhatsappModal);

whatsappForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const result = AccountStore.signupWithWhatsapp({
    name: formData.get("name"),
    phone: formData.get("phone"),
    grade: formData.get("grade"),
    role: selectedRole("whatsapp-role"),
  });

  if (!whatsappNote) return;

  if (!result.success) {
    whatsappNote.textContent = result.error;
    whatsappNote.classList.remove("success");
    return;
  }

  whatsappNote.textContent =
    "WhatsApp signup saved. We will connect this flow to WhatsApp verification and class updates next.";
  whatsappNote.classList.add("success");
  updateAuthUi();
  form.reset();
  window.setTimeout(closeWhatsappModal, 1200);
});

const SupportChat = {
  getMessages() {
    const messages = localStorage.getItem("speaknsolve_support_messages");
    return messages
      ? JSON.parse(messages)
      : [
          {
            from: "bot",
            text: "Hi! I can help with Google login, admin/teacher/parent accounts, WhatsApp signup, and pilot classes.",
          },
        ];
  },
  saveMessages(messages) {
    localStorage.setItem("speaknsolve_support_messages", JSON.stringify(messages.slice(-30)));
  },
  addMessage(from, text) {
    const messages = this.getMessages();
    messages.push({ from, text, at: new Date().toISOString() });
    this.saveMessages(messages);
    renderSupportMessages();
  },
  replyTo(message) {
    const lower = message.toLowerCase();
    if (lower.includes("whatsapp")) {
      const configured = config.whatsappNumber
        ? ` You can also message us on WhatsApp at ${config.whatsappNumber}.`
        : " A WhatsApp Business number can be added in public/config.js.";
      return `Use the WhatsApp signup button to save your role, name, and phone number.${configured}`;
    }
    if (lower.includes("google") || lower.includes("login")) {
      return "Use Login with Google, then select Admin, Teacher, or Parent. Add a Google client ID in public/config.js before production launch.";
    }
    if (lower.includes("teacher")) {
      return "Teacher login is available now as a separate role. Classroom dashboards can be added in the next backend phase.";
    }
    if (lower.includes("admin")) {
      return "Admin login is available now as a separate role for future school and operations workflows.";
    }
    if (lower.includes("parent")) {
      return "Parent login and WhatsApp signup are available now for pilot families.";
    }
    return "Thanks. I saved this support message locally so it can later be handed off to WhatsApp customer service.";
  },
};

function renderSupportMessages() {
  if (!supportChatMessages) return;
  supportChatMessages.innerHTML = SupportChat.getMessages()
    .map(
      (message) => `
        <div class="support-message ${message.from === "user" ? "user" : "bot"}">
          ${escapeHtml(message.text)}
        </div>
      `
    )
    .join("");
  supportChatMessages.scrollTop = supportChatMessages.scrollHeight;
}

function openSupportChat() {
  if (!supportChatPanel) return;
  supportChatPanel.hidden = false;
  renderSupportMessages();
  supportChatInput?.focus();
}

function closeSupportPanel() {
  if (supportChatPanel) {
    supportChatPanel.hidden = true;
  }
}

supportChatToggle?.addEventListener("click", () => {
  if (supportChatPanel?.hidden) {
    openSupportChat();
  } else {
    closeSupportPanel();
  }
});

closeSupportChat?.addEventListener("click", closeSupportPanel);

supportChatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = supportChatInput?.value.trim() || "";
  if (!text) return;
  SupportChat.addMessage("user", text);
  if (supportChatInput) {
    supportChatInput.value = "";
  }
  window.setTimeout(() => {
    SupportChat.addMessage("bot", SupportChat.replyTo(text));
  }, 200);
});

updateAuthUi();
renderSupportMessages();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const images = document.querySelectorAll(".image-card img");
const closeBtn = document.querySelector(".close-btn");

// Open lightbox
images.forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});

// Close lightbox when clicking close button
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

// Close lightbox when clicking outside image
lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) {
    lightbox.style.display = "none";
  }
});

// Menu toggle for small screens
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Profile edit interactions
const editBtn = document.getElementById("edit-profile");
const editForm = document.getElementById("edit-form");
const cancelBtn = document.getElementById("cancel-edit");
const saveBtn = document.getElementById("save-profile");
const displayName = document.getElementById("display-name");
const displayEmail = document.getElementById("display-email");
const displayBio = document.getElementById("display-bio");
const inputName = document.getElementById("input-name");
const inputEmail = document.getElementById("input-email");
const inputBio = document.getElementById("input-bio");

if (editBtn && editForm) {
  editBtn.addEventListener("click", () => {
    if (displayName) inputName.value = displayName.textContent.trim();
    if (displayEmail) inputEmail.value = displayEmail.textContent.trim();
    if (displayBio) inputBio.value = displayBio.textContent.trim();
    editForm.style.display = "block";
    editBtn.style.display = "none";
  });
}

if (cancelBtn && editForm && editBtn) {
  cancelBtn.addEventListener("click", () => {
    editForm.style.display = "none";
    editBtn.style.display = "inline-block";
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (displayName && inputName)
      displayName.textContent = inputName.value || displayName.textContent;
    if (displayEmail && inputEmail)
      displayEmail.textContent = inputEmail.value || displayEmail.textContent;
    if (displayBio && inputBio)
      displayBio.textContent = inputBio.value || displayBio.textContent;
    if (editForm && editBtn) {
      editForm.style.display = "none";
      editBtn.style.display = "inline-block";
    }
  });
}

// SETTINGS PAGE HANDLERS
const settingsName = document.getElementById("settings-name");
const saveNameBtn = document.getElementById("save-name");
const themeToggleBtn = document.getElementById("theme-toggle");
const notifToggle = document.getElementById("notif-toggle");
const deleteAccountBtn = document.getElementById("delete-account");

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme") || "dark";
  applyTheme(theme);
  if (settingsName)
    settingsName.value = localStorage.getItem("displayName") || "";
  if (notifToggle)
    notifToggle.checked = localStorage.getItem("emailNotif") === "true";
});

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

if (saveNameBtn && settingsName) {
  saveNameBtn.addEventListener("click", () => {
    localStorage.setItem("displayName", settingsName.value.trim());
    alert("Display name saved (local demo)");
  });
}

if (notifToggle) {
  notifToggle.addEventListener("change", () => {
    localStorage.setItem("emailNotif", notifToggle.checked);
  });
}

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", () => {
    if (confirm("Delete account? This will clear local demo data.")) {
      localStorage.clear();
      alert("Local data cleared. Redirecting to home.");
      window.location.href = "index.html";
    }
  });
}

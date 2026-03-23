const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const images = document.querySelectorAll(".image-card img");
const closeBtn = document.querySelector(".close-btn");

// Lightbox behavior (only on pages that have a lightbox)
if (lightbox && lightboxImg && closeBtn) {
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
}

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
  // Load saved countries on page load
  loadSavedCountries();
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

// Country Info / API integration (runs only on Country Info page)
const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const resultDiv = document.getElementById("result");

const setMessage = (message, type = "info") => {
  resultDiv.innerHTML = `<div class="message message-${type}">${message}</div>`;
};

const setLoading = (isLoading) => {
  if (!resultDiv) return;
  if (isLoading) {
    resultDiv.innerHTML = `<div class="loader" aria-label="Loading"></div>`;
  }
};

// Show success/warning message
const showSuccessMessage = (message, type = "success") => {
  const messageDiv = document.createElement("div");
  messageDiv.className = `success-message message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    background-color: ${type === "success" ? "#4CAF50" : "#ff9800"};
    color: white;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
};

// ========== LOCALSTORAGE FUNCTIONS ==========

// Save verse to localStorage
const saveVerseToStorage = (verseData) => {
  let savedVerses = JSON.parse(localStorage.getItem("savedVerses")) || [];

  // Check if verse already exists (prevent duplicates)
  const isDuplicate = savedVerses.some(
    (v) => v.reference.toLowerCase() === verseData.reference.toLowerCase(),
  );

  if (isDuplicate) {
    showSuccessMessage("This verse is already saved!", "warning");
    return false;
  }

  savedVerses.push(verseData);
  localStorage.setItem("savedVerses", JSON.stringify(savedVerses));
  showSuccessMessage("✓ Verse saved successfully!", "success");
  return true;
};

// Load saved verses from localStorage
const loadSavedVerses = () => {
  const savedList = document.getElementById("saved-list");
  if (!savedList) return;

  const savedVerses = JSON.parse(localStorage.getItem("savedVerses")) || [];

  // Empty state
  if (savedVerses.length === 0) {
    savedList.innerHTML = `
      <div style="grid-column: 1 / -1;">
        <div class="empty-state">
          <h2>No Saved Verses Yet</h2>
          <a href="country-info.html" class="btn" style="background: #667eea; color: white; padding: 10px 20px;">Search Verses</a>
        </div>
      </div>
    `;
    return;
  }

  // Display saved verses
  savedList.innerHTML = savedVerses
    .map(
      (verse, index) => `
      <div class="saved-card">
        <div class="saved-card-header">
          <h3>${verse.reference}</h3>
        </div>
        <div class="saved-card-content">
          <p class="verse-text">${verse.text}</p>
          <p><strong>Translation:</strong> ${verse.translation}</p>
          <p style="font-size: 12px; color: #999;">Saved: ${verse.savedAt}</p>
          <button class="btn-delete" onclick="deleteVerse(${index})">Delete</button>
        </div>
      </div>
    `,
    )
    .join("");
};

// Delete a verse from saved
const deleteVerse = (index) => {
  if (!confirm("Are you sure you want to delete this verse?")) return;

  let savedVerses = JSON.parse(localStorage.getItem("savedVerses")) || [];
  const deletedVerse = savedVerses[index].reference;
  savedVerses.splice(index, 1);
  localStorage.setItem("savedVerses", JSON.stringify(savedVerses));

  showSuccessMessage(`✓ ${deletedVerse} removed!`, "success");
  loadSavedVerses();
};

const renderVerse = (verseData) => {
  const reference = verseData.reference || "N/A";
  const text = verseData.text || "N/A";
  const translation = verseData.translation_name || "N/A";

  resultDiv.innerHTML = `
    <div class="verse-card">
      <div class="verse-content">
        <h2>${reference}</h2>
        <p class="verse-text">${text}</p>
        <p><strong>Translation:</strong> ${translation}</p>
        <div class="verse-actions">
          <button class="btn btn-save" id="save-verse-btn">Save Verse</button>
        </div>
      </div>
    </div>
  `;

  // Add save button functionality
  const saveVerseBtn = document.getElementById("save-verse-btn");
  if (saveVerseBtn) {
    saveVerseBtn.addEventListener("click", () => {
      saveVerseToStorage({
        reference: reference,
        text: text,
        translation: translation,
        savedAt: new Date().toLocaleString(),
      });
    });
  }
};

const searchVerse = async () => {
  if (!countryInput || !resultDiv) return;
  const verse = countryInput.value.trim();
  if (!verse) {
    setMessage("Please enter a verse reference.", "error");
    return;
  }

  setLoading(true);

  try {
    // Parse the verse reference to get book, chapter, verse
    const verseMatch = verse.match(/^(\w+)\s+(\d+):(\d+)$/);
    if (verseMatch) {
      const book = verseMatch[1];
      const chapter = verseMatch[2];
      const verseNum = parseInt(verseMatch[3]);
      // Fetch a range: verse-1 to verse+1 for context
      const startVerse = Math.max(1, verseNum - 1);
      const endVerse = verseNum + 1;
      const rangeQuery = `${book} ${chapter}:${startVerse}-${endVerse}`;
      var query = rangeQuery;
    } else {
      var query = verse;
    }

    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error("Verse not found");

    const data = await response.json();
    if (!data || !data.text) throw new Error("No data received from API.");

    renderVerse(data);
    setLoading(false);
  } catch (error) {
    setMessage(`Error: ${error.message}. Please try again.`, "error");
    setLoading(false);
  }
};

if (searchBtn && countryInput) {
  searchBtn.addEventListener("click", searchVerse);
  countryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchVerse();
  });
}

// Load saved verses if on saved-verses page
if (window.location.pathname.includes("saved-verses.html")) {
  loadSavedVerses();
}

// Menu toggle for mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Load and display saved countries
const loadSavedCountries = () => {
  const savedList = document.getElementById("saved-list");
  if (!savedList) return;

  const savedCountries =
    JSON.parse(localStorage.getItem("savedCountries")) || [];

  // Empty state
  if (savedCountries.length === 0) {
    savedList.innerHTML = `
      <div style="grid-column: 1 / -1;">
        <div class="empty-state">
          <h2>No Saved Countries Yet</h2>
          <p>Start exploring countries and save your favorites to see them here!</p>
          <a href="country-info.html" class="btn-explore">Explore Countries</a>
        </div>
      </div>
    `;
    return;
  }

  // Display saved countries
  savedList.innerHTML = savedCountries
    .map(
      (country, index) => `
      <div class="saved-card">
        ${country.flag ? `<img src="${country.flag}" alt="Flag of ${country.name}" class="saved-card-flag" />` : '<div style="width: 100%; height: 140px; background: #e0e0e0;"></div>'}
        <div class="saved-card-content">
          <h3>${country.name}</h3>
          <p><span class="saved-info-label">Capital:</span> ${country.capital}</p>
          <p><span class="saved-info-label">Population:</span> ${country.population ? country.population.toLocaleString() : "N/A"}</p>
          <p><span class="saved-info-label">Region:</span> ${country.region}</p>
          <p><span class="saved-info-label">Currency:</span> ${country.currency}</p>
          <p class="saved-timestamp">Saved: ${country.saved_at}</p>
          <div class="saved-card-actions">
            <button class="btn-delete" onclick="deleteCountry(${index})">Delete</button>
          </div>
        </div>
      </div>
    `,
    )
    .join("");

  // Add a "Clear All" button at the bottom if there are saved countries
  if (savedCountries.length > 0) {
    const clearAllBtn = document.createElement("button");
    clearAllBtn.className = "clear-all-btn";
    clearAllBtn.textContent = "Clear All Saved Countries";
    clearAllBtn.onclick = clearAllCountries;
    savedList.parentElement.appendChild(clearAllBtn);
  }
};

// Delete a single country
const deleteCountry = (index) => {
  if (!confirm("Are you sure you want to delete this country?")) return;

  let savedCountries = JSON.parse(localStorage.getItem("savedCountries")) || [];
  const deletedName = savedCountries[index].name;
  savedCountries.splice(index, 1);
  localStorage.setItem("savedCountries", JSON.stringify(savedCountries));

  showSuccessMessage(`✓ ${deletedName} has been removed!`, "success");
  loadSavedCountries();
};

// Clear all saved countries
const clearAllCountries = () => {
  if (
    !confirm(
      "Are you sure you want to delete ALL saved countries? This cannot be undone.",
    )
  )
    return;

  localStorage.removeItem("savedCountries");
  showSuccessMessage("✓ All saved countries have been cleared!", "success");
  loadSavedCountries();
};

// Show success message
const showSuccessMessage = (message, type = "success") => {
  const messageDiv = document.createElement("div");
  messageDiv.className = `success-banner message-${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => messageDiv.remove(), 300);
  }, 2500);
};

// Load saved countries on page load
document.addEventListener("DOMContentLoaded", () => {
  loadSavedCountries();
});

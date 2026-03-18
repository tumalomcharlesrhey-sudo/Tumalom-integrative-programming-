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

const loadReligionData = async () => {
  if (window.__religionCache) return window.__religionCache;
  try {
    const response = await fetch("religions.json");
    if (!response.ok) throw new Error("Unable to load religion data.");
    const data = await response.json();
    window.__religionCache = data;
    return data;
  } catch (error) {
    console.warn("Religion data load failed:", error);
    return null;
  }
};

const formatCurrency = (currencies) => {
  if (!currencies || !Object.keys(currencies).length) return "N/A";
  return Object.values(currencies)
    .map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`)
    .join(", ");
};

const formatReligionList = (countryName, population, religionsData) => {
  if (!religionsData) return "Religion data not available.";

  const key = Object.keys(religionsData).find(
    (k) => k.toLowerCase() === countryName.toLowerCase(),
  );
  if (!key) return "No religion breakdown available for this country.";

  const items = religionsData[key];
  if (!items || !items.length)
    return "No religion breakdown available for this country.";

  const listItems = items
    .map((item) => {
      const percent = item.percent || 0;
      const count =
        population && percent ? Math.round((population * percent) / 100) : null;
      const countText = count ? ` (~${count.toLocaleString()} people)` : "";
      return `<li><strong>${item.name}</strong>: ${percent}%${countText}</li>`;
    })
    .join("");

  return `<ul class="religion-list">${listItems}</ul>`;
};

const setMessage = (message, type = "info") => {
  resultDiv.innerHTML = `<div class="message message-${type}">${message}</div>`;
};

const setLoading = (isLoading) => {
  if (!resultDiv) return;
  if (isLoading) {
    resultDiv.innerHTML = `<div class="loader" aria-label="Loading"></div>`;
  }
};

// ========== LOCALSTORAGE FUNCTIONS ==========

// Save country to localStorage
const saveCountryToStorage = (countryData) => {
  let savedCountries = JSON.parse(localStorage.getItem("savedCountries")) || [];

  // Check if country already exists (prevent duplicates)
  const isDuplicate = savedCountries.some(
    (c) => c.name.toLowerCase() === countryData.name.toLowerCase(),
  );

  if (isDuplicate) {
    showSuccessMessage("This country is already saved!", "warning");
    return false;
  }

  savedCountries.push(countryData);
  localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
  showSuccessMessage("✓ Country saved successfully!", "success");
  return true;
};

// Load saved countries from localStorage
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
          <p>Search for countries and click "Save Country" to add them here!</p>
          <a href="country-info.html" class="btn" style="background: #2196f3; color: white; padding: 10px 20px;">Search Countries</a>
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
        <div style="width: 100%; height: 140px; background: linear-gradient(135deg, #2196f3, #42a5f5); display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center; color: white;">
            ${country.flag ? `<img src="${country.flag}" alt="Flag" style="height: 50px; margin-bottom: 8px;">` : ""}
            <div style="font-weight: bold; font-size: 18px;">${country.name}</div>
          </div>
        </div>
        <div class="saved-card-content">
          <h3>${country.name}</h3>
          <p><strong>Capital:</strong> ${country.capital}</p>
          <p><strong>Population:</strong> ${country.population?.toLocaleString() || "N/A"}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Currency:</strong> ${country.currencies}</p>
          <p style="font-size: 12px; color: #999;">Saved: ${country.savedAt}</p>
          <button class="btn-delete" onclick="deleteCountry(${index})">🗑️ Delete</button>
        </div>
      </div>
    `,
    )
    .join("");
};

// Delete a country from saved
const deleteCountry = (index) => {
  if (!confirm("Are you sure you want to delete this country?")) return;

  let savedCountries = JSON.parse(localStorage.getItem("savedCountries")) || [];
  const deletedCountry = savedCountries[index].name;
  savedCountries.splice(index, 1);
  localStorage.setItem("savedCountries", JSON.stringify(savedCountries));

  showSuccessMessage(`✓ ${deletedCountry} removed!`, "success");
  loadSavedCountries();
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

const fetchWeather = async (capital) => {
  if (!capital) return "Weather unavailable";
  try {
    const weatherResponse = await fetch(
      `https://wttr.in/${encodeURIComponent(capital)}?format=j1`,
    );
    if (!weatherResponse.ok) return "Weather unavailable";
    const weatherData = await weatherResponse.json();
    const current = weatherData.current_condition?.[0];
    if (!current) return "Weather unavailable";
    const temp = current.temp_C;
    const condition = current.weatherDesc?.[0]?.value;
    return `${temp}°C, ${condition}`;
  } catch (error) {
    return "Weather unavailable";
  }
};

const renderCountry = async (countryData) => {
  const flag = countryData.flags?.png || "";
  const name = countryData.name?.common || "N/A";
  const capital = countryData.capital?.[0] || "N/A";
  const population = countryData.population || 0;
  const region = countryData.region || "N/A";
  const subregion = countryData.subregion || "N/A";

  const currencies = formatCurrency(countryData.currencies);
  const weatherInfo = await fetchWeather(capital);

  const religionsData = await loadReligionData();
  const religionsHtml = formatReligionList(name, population, religionsData);
  const populationText = population ? population.toLocaleString() : "N/A";

  resultDiv.innerHTML = `
    <div class="country-card">
      ${flag ? `<img src="${flag}" alt="Flag of ${name}" class="country-flag" />` : ""}
      <div class="country-content">
        <h2>${name}</h2>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${populationText}</p>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Subregion:</strong> ${subregion}</p>
        <p><strong>Currency:</strong> ${currencies}</p>
        <p><strong>Weather in ${capital}:</strong> ${weatherInfo}</p>
        <div class="religion-section">
          <h3>Religions (est.)</h3>
          ${religionsHtml}
        </div>
        <div class="country-actions">
          <button class="btn btn-save" id="save-country-btn">💾 Save Country</button>
          <a href="saved-countries.html" class="btn btn-view-saved">📋 View Saved</a>
        </div>
      </div>
    </div>
  `;

  // Add save button functionality
  const saveCountryBtn = document.getElementById("save-country-btn");
  if (saveCountryBtn) {
    saveCountryBtn.addEventListener("click", () => {
      saveCountryToStorage({
        name: name,
        capital: capital,
        population: population,
        region: region,
        subregion: subregion,
        currencies: currencies,
        flag: flag,
        savedAt: new Date().toLocaleString(),
      });
    });
  }
};

const searchCountry = async () => {
  if (!countryInput || !resultDiv) return;
  const country = countryInput.value.trim();
  if (!country) {
    setMessage("Please enter a country name.", "error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`,
    );
    if (!response.ok) throw new Error("Country not found");

    const data = await response.json();
    const countryData = data?.[0];
    if (!countryData) throw new Error("No data received from API.");

    await renderCountry(countryData);
  } catch (error) {
    setMessage(`Error: ${error.message}. Please try again.`, "error");
  }
};

if (searchBtn && countryInput) {
  searchBtn.addEventListener("click", searchCountry);
  countryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchCountry();
  });
}

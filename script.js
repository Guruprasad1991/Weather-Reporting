// ---- Your API key from openweathermap.org ----
const API_KEY = "fb44ef76e9c14059bcee0ae1ba6e62e7";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ---- Grab the DOM elements once, up top (so we don't re-query every time) ----
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const errorMessage = document.getElementById("error-message");
const weatherCard = document.getElementById("weather-card");

const datetimeEl = document.getElementById("datetime");
const cityNameEl = document.getElementById("city-name");
const iconEl = document.getElementById("weather-icon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

// ---- Fetch current weather for a city ----
async function getWeather(city) {
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      // 404 = city not found, 401 = bad or inactive API key
      throw new Error(
        response.status === 404 ? "City not found" : "Something went wrong"
      );
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

// ---- Put the data on screen ----
function displayWeather(data) {
  hideError();

  datetimeEl.textContent = formatDateTime(data.dt, data.timezone);
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;
  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconEl.alt = data.weather[0].description;

  weatherCard.classList.remove("hidden"); // reveal the card from step 2
}

// ---- Format the city's LOCAL date & time ----
function formatDateTime(dt, timezone) {
  // Both values are in seconds. dt is UTC; timezone is the city's offset.
  // Adding them, then reading as UTC, gives that city's local time.
  const local = new Date((dt + timezone) * 1000);
  return local.toLocaleString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

// ---- Error helpers ----
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function hideError() {
  errorMessage.classList.add("hidden");
}

// ---- Read the input, validate, then fetch ----
function handleSearch() {
  const city = cityInput.value.trim();
  if (city === "") {
    showError("Please enter a city name");
    return;
  }
  getWeather(city);
}

// ---- Wire up the events ----
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

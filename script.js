const CITIES = [
  { name: 'Tokyo', id: 'tokyo', lat: 35.6895, lon: 139.6917 },
  { name: 'London', id: 'london', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', id: 'new-york', lat: 40.7128, lon: -74.0060 }
];

// Map Open-Meteo weather codes to descriptive text and emojis
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌧️❄️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️❄️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌧️❄️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️❄️' },
  71: { description: 'Slight snow', icon: '❄️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '🌧️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️🌨️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️🌨️' },
};

const getWeatherInfo = (code) => {
  return WEATHER_CODES[code] || { description: 'Unknown conditions', icon: '🌡️' };
};

const loadingEl = document.getElementById('loading');
const errorContainerEl = document.getElementById('error-container');
const errorMessageEl = document.getElementById('error-message');
const weatherContainerEl = document.getElementById('weather-container');
const retryBtn = document.getElementById('retry-btn');

async function fetchWeatherData() {
  // Reset UI states
  loadingEl.classList.remove('hidden');
  errorContainerEl.classList.add('hidden');
  weatherContainerEl.classList.add('hidden');
  weatherContainerEl.innerHTML = '';

  try {
    // Artificial delay to demonstrate the loading spinner smoothly
    await new Promise(resolve => setTimeout(resolve, 600));

    // Create array of fetch promises for Promise.all
    const fetchPromises = CITIES.map(city => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
      
      return fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${city.name}`);
        }
        return response.json();
      });
    });

    // Execute all API requests simultaneously
    const results = await Promise.all(fetchPromises);

    // Render cards
    results.forEach((data, index) => {
      const city = CITIES[index];
      const currentWeather = data.current_weather;
      renderCard(city, currentWeather);
    });

    // Update visibility
    loadingEl.classList.add('hidden');
    weatherContainerEl.classList.remove('hidden');

  } catch (error) {
    loadingEl.classList.add('hidden');
    errorContainerEl.classList.remove('hidden');
    errorMessageEl.textContent = error.message || 'An error occurred while fetching weather data. Please try again later.';
    console.error('Weather fetch error:', error);
  }
}

function renderCard(city, weatherData) {
  const codeInfo = getWeatherInfo(weatherData.weathercode);
  const tempRounded = Math.round(weatherData.temperature);
  
  const card = document.createElement('div');
  card.className = `weather-card ${city.id}`;
  
  card.innerHTML = `
    <h2 class="city-name">${city.name}</h2>
    <div class="weather-icon">${codeInfo.icon}</div>
    <div class="temperature">${tempRounded}°C</div>
    <div class="condition">${codeInfo.description}</div>
  `;
  
  weatherContainerEl.appendChild(card);
}

// Initial fetch on page load
fetchWeatherData();

// Retry logic on error
retryBtn.addEventListener('click', fetchWeatherData);

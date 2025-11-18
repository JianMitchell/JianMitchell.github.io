// OpenWeatherMap API Configuration
// the following was inspired by the source:
// https://www.freecodecamp.org/news/how-to-fetch-data-from-an-api-using-the-fetch-api-in-javascript/
const API_KEY = "f8eccef0262c35ad4825b675fa5b47df";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

document.querySelector("#weatherForm").addEventListener("submit", handleFormSubmit);

document.querySelector("#cityInput").addEventListener("input", validateInputRealTime);

function handleFormSubmit(e) {
  e.preventDefault();

  document.querySelector("#errorMessage").innerHTML = "";
  document.querySelector("#errorDisplay").className = "error-display hidden";

  let cityName = document.querySelector("#cityInput").value.trim();

  if (!validateCityInput(cityName)) {
    return false;
  }

  fetchWeatherData(cityName);
}

function validateInputRealTime() {
  let cityName = document.querySelector("#cityInput").value.trim();
  let errorMessage = document.querySelector("#errorMessage");

  if (cityName.length > 0 && cityName.length < 2) {
    errorMessage.innerHTML = "City name must be at least 2 characters long";
  } else if (cityName.length > 50) {
    errorMessage.innerHTML = "City name is too long (max 50 characters)";
  } else if (cityName.length > 0) {
    let isValid = true;
    for (let i = 0; i < cityName.length; i++) {
      let char = cityName[i];
      if (!((char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === " " || char === "-")) {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      errorMessage.innerHTML = "City name should only contain letters, spaces, and hyphens";
    } else {
      errorMessage.innerHTML = "";
    }
  } else {
    errorMessage.innerHTML = "";
  }
}

function validateCityInput(cityName) {
  let errorMessage = document.querySelector("#errorMessage");

  if (cityName === "") {
    errorMessage.innerHTML = "Please enter a city name";
    return false;
  }

  if (cityName.length < 2) {
    errorMessage.innerHTML = "City name must be at least 2 characters long";
    return false;
  }

  if (cityName.length > 50) {
    errorMessage.innerHTML = "City name is too long (max 50 characters)";
    return false;
  }

  let isValid = true;
  for (let i = 0; i < cityName.length; i++) {
    let char = cityName[i];
    if (!((char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === " " || char === "-")) {
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    errorMessage.innerHTML = "City name should only contain letters, spaces, and hyphens";
    return false;
  }

  return true;
}

async function fetchWeatherData(cityName) {
  try {
    document.querySelector("#loadingIndicator").className = "loading";
    document.querySelector("#weatherDisplay").className = "weather-display hidden";
    document.querySelector("#errorDisplay").className = "error-display hidden";

    let url = `${API_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;

    let response = await fetch(url);
    let data = await response.json();

    console.log("Weather data received:", data);

    if (!response.ok) {
      if (response.status === 404) {
        displayError("City not found");
      } else if (response.status === 401) {
        displayError("API key error");
      } else {
        displayError("Failed to fetch weather data");
      }
      return;
    }

    displayWeatherData(data);

  } catch (error) {
    console.error("Error fetching weather:", error);
    displayError("Network error");
  } finally {
    document.querySelector("#loadingIndicator").className = "loading hidden";
  }
}

function displayWeatherData(data) {
  let cityName = data.name;
  let country = data.sys.country;
  let temperature = Math.round(data.main.temp);
  let feelsLike = Math.round(data.main.feels_like);
  let humidity = data.main.humidity;
  let windSpeed = data.wind.speed;
  let pressure = data.main.pressure;
  let description = data.weather[0].description;
  let iconCode = data.weather[0].icon;

  console.log("Temperature:", temperature);
  console.log("Feels Like:", feelsLike);
  console.log("Humidity:", humidity);
  console.log("Wind Speed:", windSpeed);
  console.log("Pressure:", pressure);

  document.querySelector("#cityName").innerHTML = `${cityName}, ${country}`;

  // The following Date() was inspired from the following source:
  // https://www.w3schools.com/jsref/jsref_tolocaledatestring.asp
  document.querySelector("#weatherDate").innerHTML = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.querySelector("#temp").innerHTML = temperature;
  document.querySelector("#weatherDescription").innerHTML = description;
  document.querySelector("#weatherIcon").innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">`;
  document.querySelector("#feelsLike").innerHTML = `${feelsLike}°C`;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  document.querySelector("#windSpeed").innerHTML = `${windSpeed} m/s`;
  document.querySelector("#pressure").innerHTML = `${pressure} hPa`;

  changeBackgroundByTemperature(temperature);

  document.querySelector("#weatherDisplay").className = "weather-display";
}

function changeBackgroundByTemperature(temp) {
  let body = document.querySelector("body");

  if (temp < 0) {
    body.style.background = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
  } else if (temp < 10) {
    body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  } else if (temp < 20) {
    body.style.background = "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
  } else if (temp < 30) {
    body.style.background = "linear-gradient(135deg, #fa709a 0%, #fee140 100%)";
  } else {
    body.style.background = "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";
  }
}

function displayError(message) {
  document.querySelector("#errorText").innerHTML = message;
  document.querySelector("#errorDisplay").className = "error-display";
  document.querySelector("#weatherDisplay").className = "weather-display hidden";
}
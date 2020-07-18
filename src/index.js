function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function currentDate(date) {
  let hours = addZero(date.getHours());
  let minutes = addZero(date.getMinutes());
  let number = date.getDate();
  let month = date.getMonth();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  month = months[date.getMonth()];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let today = days[date.getDay()];

  return `${today} ${number} ${month}, ${hours}:${minutes}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${minutes}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

let now = new Date();
let date = document.querySelector("#full-date");
date.innerHTML = currentDate(now);

function displaydata(response) {
  document.querySelector("#full-city").innerHTML = response.data.name;

  document.querySelector("#change-temp").innerHTML = Math.round(
    response.data.main.temp
  );

  let description = response.data.weather[0].description;
  let weatherType = document.querySelector("#description");
  description = description.charAt(0).toUpperCase() + description.slice(1);
  weatherType.innerHTML = description;
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#extrahumidity").innerHTML = Math.round(
    response.data.main.humidity
  );

  let windy = (document.querySelector("#extrawind").innerHTML = Math.round(
    response.data.wind.speed
  ));

  let feelslike = (document.querySelector(
    "#extrafeelslike"
  ).innerHTML = Math.round(response.data.main.feels_like));

  iconElement.setAttribute(
    "src",
    `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${response.data.weather[0].icon}.svg`
  );
}
function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = null;
  forecastElement.innerHTML = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
  <div class="col-2">
    <h4>
      ${formatHours(forecast.dt * 1000)}
    </h4>
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
      forecast.weather[0].icon
    }.svg"
      />

    <div class="forecast-description">${forecast.weather[0].description} </div>
    <div class="forecast-temp"><strong>${Math.round(
      forecast.main.temp_max
    )}°</strong> ${Math.round(forecast.main.temp_min)}°</div>
  </div>
  `;
  }
}

function toSearch(city) {
  let apiKey = "c3f2e22d068bc89a846c4b1c217f57c3";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displaydata);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#find-weather").value;
  toSearch(city);
}

let search = document.querySelector("#search-city");
search.addEventListener("submit", handleSubmit);

//chaninging units
function convertFahrenheit(event) {
  event.preventDefault();
  let changeTemp = document.querySelector("#change-temp");
  let degreeNumber = changeTemp.innerHTML;
  degreeNumber = Number(degreeNumber);
  let fahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  changeTemp.innerHTML = `${fahrenheit}`;
}
let celsiusTemperature = null;

function convertCelsius(event) {
  event.preventDefault();
  let changeTemp = document.querySelector("#change-temp");
  let degreeNumber = changeTemp.innerHTML;
  degreeNumber = Number(degreeNumber);
  let celsius = Math.round(celsiusTemperature);
  changeTemp.innerHTML = `${celsius}`;
}

let getFahrenheit = document.querySelector("#fahrenheit-unit");
getFahrenheit.addEventListener("click", convertFahrenheit);
let getCelsius = document.querySelector("#celcius-unit");
getCelsius.addEventListener("click", convertCelsius);

toSearch("Vancouver");

function showPosition(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);

  let apiKey = "c3f2e22d068bc89a846c4b1c217f57c3";
  let units = "metric";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  console.log(apiUrl);

  axios.get(apiUrl).then(displaydata);
  axios.get(apiUrl).then(showForecast);
}

function currentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let button = document.querySelector("#current-location");
button.addEventListener("click", currentPosition);

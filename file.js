const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Location not found');
        } else {
          throw new Error('Network response was not ok');
        }
      }
      return response.json();
    })
    .then(weatherData => {
      const { coord } = weatherData;
      const uvUrl = `${BASE_URL}/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;
      const airQualityUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;

      return Promise.all([
        fetch(uvUrl).then(response => response.json()),
        fetch(airQualityUrl).then(response => response.json())
      ]).then(([uvData, airQualityData]) => {
        return { weatherData, uvData, airQualityData };
      });
    });
}

function updateUI({ weatherData, uvData, airQualityData }) {
  console.log(weatherData, uvData, airQualityData);

  const tempElements = document.querySelectorAll('.temp');
  const visibilityElement = document.querySelector('.visibility');
  const weatherIconElement = document.querySelector('.weather-icon img');
  const cardIconElement = document.querySelector('.card-icon img');
  const dayNameElement = document.querySelector('.day-name');
  const locationElement = document.querySelector('.location');
  const conditionElement = document.getElementById('condition');
  const rainElement = document.getElementById('rain');
  const uvIndexElement = document.querySelector('.uv-index');
  const airQualityElement = document.querySelector('.air-quality');
  const windSpeedElement = document.querySelector('.wind-speed');
  const humidityElement = document.querySelector('.humidity');

  tempElements.forEach(element => {
    element.textContent = `${Math.round(weatherData.main.temp)}°C`;
  });

  visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
  weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  locationElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  conditionElement.textContent = weatherData.weather[0].description;
  rainElement.textContent = `${weatherData.clouds.all}%`;

  uvIndexElement.textContent = uvData.value;
  airQualityElement.textContent = airQualityData.list[0].main.aqi;
  windSpeedElement.textContent = `${weatherData.wind.speed} m/s`;
  humidityElement.textContent = `${weatherData.main.humidity}%`;

  const today = new Date();
  const options = { weekday: 'long' };
  const day = today.toLocaleDateString('en-US', options);
  dayNameElement.textContent = day;

  updateCardIcon(day);

  updateBackgroundAndIcon(weatherData.weather[0].description);

  const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.querySelector('.sunrise').textContent = sunriseTime;
  document.querySelector('.sunset').textContent = sunsetTime;
}

function updateCardIcon(day) {
  const cardIconElement = document.querySelector('.card-icon img');
  switch (day) {
    case 'Monday':
      cardIconElement.src = "monday.png";
      break;
    case 'Tuesday':
      cardIconElement.src = "tuesday.png";
      break;
    case 'Wednesday':
      cardIconElement.src = "wednesday.png";
      break;
    case 'Thursday':
      cardIconElement.src = "thursday.png";
      break;
    case 'Friday':
      cardIconElement.src = "friday.png";
      break;
    case 'Saturday':
      cardIconElement.src = "saturday.png";
      break;
    case 'Sunday':
      cardIconElement.src = "sunday.png";
      break;
    default:
      cardIconElement.src = "default.png";
      break;
  }
}

function updateBackgroundAndIcon(description) {
  const body = document.body;
  const normalizedDescription = description.toLowerCase().trim();
  switch (normalizedDescription) {
      case 'clear sky':
          body.style.backgroundImage = "url('clearsky.jpg')";
          break;
      case 'few clouds':
          body.style.backgroundImage = "url('fewclouds.jpg')";
          break;
      case 'scattered clouds':
          body.style.backgroundImage = "url('scattered-clouds.jpg')";
          break;
      case 'broken clouds':
          body.style.backgroundImage = "url('broken.jpg')";
          break;
      case 'shower rain':
          body.style.backgroundImage = "url('showerrain.jpg')";
          break;
      case 'rain':
          body.style.backgroundImage = "url('rain.jpg')";
          break;
      case 'thunderstorm':
          body.style.backgroundImage = "url('thunderstorm.jpg')";
          break;
      case 'snow':
          body.style.backgroundImage = "url('snow.jpg')";
          break;
      case 'mist':
          body.style.backgroundImage = "url('mist.jpg')";
          break;
      case 'haze':
          body.style.backgroundImage = "url('haze.jpg')";
          break;
      case 'fog':
          body.style.backgroundImage = "url('fog.jpg')";
          break;
      case 'smoke':
          body.style.backgroundImage = "url('smoke.jpg')";
          break;
      case 'dust':
          body.style.backgroundImage = "url('dust.jpg')";
          break;
      case 'sand':
          body.style.backgroundImage = "url('sand.jpg')";
          break;
      case 'ash':
          body.style.backgroundImage = "url('ash.jpg')";
          break;
      case 'squall':
          body.style.backgroundImage = "url('squall.jpg')";
          break;
      case 'tornado':
          body.style.backgroundImage = "url('tornado.jpg')";
          break;
      case 'hot':
          body.style.backgroundImage = "url('hot.jpg')";
          break;
      case 'cold':
          body.style.backgroundImage = "url('cold.jpg')";
          break;
      case 'windy':
          body.style.backgroundImage = "url('windy.jpg')";
          break;
      case 'blizzard':
          body.style.backgroundImage = "url('blizzard.jpg')";
          break;
      case 'overcast clouds':
          body.style.backgroundImage = "url('overcast.jpg')";
          break;
      case 'moderate rain':
          body.style.backgroundImage = "url('moderaterain.jpg')";
          break;
      case 'light rain':
          body.style.backgroundImage = "url('lightrain.jpg')";
          break;
      default:
          body.style.backgroundImage = "url('default.jpg')";
          break;
  }
}

document.getElementById('search').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('query').value;
  getCurrentWeather(city)
    .then(data => {
      updateUI(data);
    })
    .catch(error => {
      if (error.message === 'Location not found') {
        alert('The specified location was not found. Please try again.');
      } else {
        console.error('There was a problem with the fetch operation:', error);
      }
    });
});

getCurrentWeather('London')
  .then(data => {
    updateUI(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
























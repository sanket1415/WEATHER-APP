// Your existing API key and conversion function
const apiKey = '342WTWBAKJV52ARAHPJ4HKVC8';
const URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}

// Function to check login
function checkLogin(username, password) {
    // For simplicity, use hardcoded credentials (You can replace this with real authentication)
    const validUsername = "user";
    const validPassword = "password";
    
    return username === validUsername && password === validPassword;
}

// Event listener for login form
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (checkLogin(username, password)) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('weather-app').style.display = 'block'; // Show the weather app
        updateWeatherInfo('Delhi'); // Initialize with a default city (Delhi)
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Fetch weather info function (same as you already have)
async function fetchWeather(city) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`);
    const data = await response.json();
    return data;
}

async function updateWeatherInfo(city) {
    try {
        const weatherData = await fetchWeather(city);

        const weatherInfo = {
            city: weatherData.address,
            temp: fahrenheitToCelsius(weatherData.currentConditions.temp),
            condition: weatherData.currentConditions.conditions,
            feltTemp: fahrenheitToCelsius(weatherData.currentConditions.feelslike),
            humidity: weatherData.currentConditions.humidity,
            wind: weatherData.currentConditions.windspeed,
            visibility: weatherData.currentConditions.visibility,
            maxTemp: fahrenheitToCelsius(weatherData.days[0].tempmax),
            minTemp: fahrenheitToCelsius(weatherData.days[0].tempmin),
        };

        document.querySelector('.current-weather h2').textContent = weatherInfo.city;
        document.querySelector('.current-weather h1').innerHTML = `${weatherInfo.temp} &#8451;`;
        document.querySelector('.current-weather p').textContent = weatherInfo.condition;

        const weatherItems = document.querySelectorAll('.weather-item .value');
        weatherItems[0].textContent = `${weatherInfo.feltTemp} °C`;
        weatherItems[1].textContent = `${weatherInfo.humidity}%`;
        weatherItems[2].textContent = `${weatherInfo.wind} Km/h`;
        weatherItems[3].textContent = `${weatherInfo.visibility} Km`;
        weatherItems[4].textContent = `${weatherInfo.maxTemp} °C`;
        weatherItems[5].textContent = `${weatherInfo.minTemp} °C`;

        // Update the 7-day forecast
        const forecastContainer = document.querySelector('.forecast');
        forecastContainer.innerHTML = ''; // Clear existing forecast

        for (let i = 0; i < 7; i++) {
            const dayForecast = weatherData.days[i];
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            const date = new Date(dayForecast.datetime);
            const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const [weekday, monthDay, year] = formattedDate.split(',');

            dayElement.innerHTML = `
                <div class="date">
                    <div class="number">${monthDay.trim()}</div>
                    <div class="Type">${weekday}</div>
                    <div class="year">${year.trim()}</div>
                </div>
                <div class="Temprature">${fahrenheitToCelsius(dayForecast.tempmax)}&#8451; / &#9790 ${fahrenheitToCelsius(dayForecast.tempmin)}&#8451;</div>
                <div class="status">${dayForecast.conditions} &#9925;</div>
            `;
            forecastContainer.appendChild(dayElement);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Could not fetch weather data. Please try again.');
    }
}

// const apiKey = 'my_API_key'

// API Key for OpenWeatherMap API
const apiKey = '0271dc5cc15767ab5d712f36bfc476c3'

// Input field for searching cities
const findCity = document.querySelector('#findCity')

// Default unit for temperature
let unit = "metric";

// Temprature Toggle
const unitToggle = document.querySelector('#unitToggle');
unitToggle.addEventListener('click', () => {
    if (unit === "metric") {
        unit = "imperial";
        unitToggle.innerText = "°F";
    } else {
        unit = "metric";
        unitToggle.innerText = "°C";
    }
// refetch weather when the unit is changed
    fetchWeather(currentCity);
});

// Button to get weather for user's current location
const currentLocation = document.querySelector(".crntBtn");
currentLocation.addEventListener('click', (e) => {
    navigator.geolocation.getCurrentPosition(console.log)
    // navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //         const { latitude, longitude } = position.coords;
    //         fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    //             .then((res) => res.json()
    //                 .then((data) => {
    //                     console.log(data);
    //                     // const city = data.name;
    //                     // fetchWeather(city);
    //                 }))
    //     }
    // )

})
// Default city to show on page load
let currentCity = "Delhi"
// Fetch weather for the given city
async function fetchWeather(city) {
    try {
        currentCity = city
        // fetch weather for thecity
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)

        // Alert if response is not right.
        if (!response.ok) {
            let errResponse = await response.json();
            // custom alert
            showAlert(errResponse.message || 'City not found');
            return;
        }
        // convert into parse data
        const data = await response.json();
        
        // got lat and lon to fetch forecast data
        let lat, lon;
        lat = data.coord.lat
        lon = data.coord.lon
        console.log(lat, lon);
                
        // fetch forecast data
        const forecastResponse = await fetch(
            // This API is paid one and need subscription
            // `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}`
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        //  if forecast respnse is not right
        if (!forecastResponse.ok) {
            let errForecast = await forecastResponse.json();
            // custom alert
            showAlert(errForecast.message || 'City not found');
            return;
        }
        // convert into parse data
        const forecastData = await forecastResponse.json();
        console.log(data);
        console.log(data.coord.lat);
        console.log(data.coord.lon);

        // Extract required data from the response
        let humid = data.main.humidity
        let prsr = data.main.pressure
        let temp = data.main.temp
        let windDeg = data.wind.deg
        let windSpeed = data.wind.speed
        let icon = data.weather[0].icon

        // Formatted Date and Time and took help from google search for this
        let formatted = new Date().toLocaleString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        // Show alert if temperature is too high either in matric or imperial
        if ((unit === 'metric' && temp > 40) || (unit === 'imperial' && temp > 104)) {
            // custom alert
            showAlert('Temperature is too High..')
        }

        // URL for icon of the weather
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

        // change Background Image based on weather
        setBgByWeatherId(data.weather[0].main);

        // Day, Date/Month/Year & Time only for Delhi
        const day = document.querySelector('#currentDate')
        if (city.trim().toLowerCase() === 'delhi') { day.innerText = formatted } else { day.innerText = '' }
        
        // Temprature
        const temprature = document.querySelector('#temp')
        temprature.innerText = `${(temp)}`;
        
        // Icon
        const iconWeather = document.querySelector('#iconWeather')
        iconWeather.src = iconUrl
        
        // Find city 
        const cityName = document.querySelector('#cityName')
        cityName.innerText = data.name
        
        // Humidity
        const humidity = document.querySelector('#humidity')
        const humidImage = document.querySelector('.humidImg')
        humidImage.src = './images/humidity.png'
        humidity.innerText = ` ${humid} %`
        
        // Pressure
        const pressure = document.querySelector('#pressure')
        const pressureImage = document.querySelector('.pressureImg')
        pressureImage.src = './images/barometer.png'
        pressure.innerText = ` ${prsr} hPa`
        
        // Wind
        const wind = document.querySelector('#wind')
        const windImage = document.querySelector('.windImg')
        windImage.src = './images/wind.png'
        wind.innerText = `${windDeg} Deg, ${windSpeed} spd`
        // Forecast for upcoming days
        const foreCastDays = document.querySelector('#weatherForecast');
        foreCastDays.innerHTML = ''; // clear old forecast

        // Loop through first 5 forecast items (or any number you want)
        forecastData.list.slice(0, 5).forEach(item => {
            const dayDivForecast = document.createElement('div');
            dayDivForecast.classList.add('upcomingDays');
            const forecastDate = document.createElement('div');
            forecastDate.style.fontSize = '13px'
            const forecastTemp = document.createElement('div');
            forecastTemp.style.fontSize = '14px'

            const temp = item.main.temp;
            const main = item.weather[0].main;
            const icon = item.weather[0].icon;
            const date = item.dt_txt;
            const humidity = item.main.humidity;
            const windDeg = item.wind.speed;
            const windSpeed = item.wind.deg;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            // To show forecast Date, Icon, Temp, Humidity, Wind
            forecastDate.innerHTML = `
            <p>${date}</p>
            <img src="${iconUrl}" width='50px' alt="${main}" />
            `;
            forecastTemp.innerHTML = `
            <div style="display:flex;flex-direction:column ;gap:5px">            
                <div style="display:flex; gap:12px">
                    <img src='./images/high-temperature.png' width=20/>
                    <p>${temp} °C</p>
                </div>
                <div style="display:flex; gap:20px">
                    <img src="./images/humidity.png" width=15 height=10 />
                    <p>${humidity} %</p>
                </div>
                <div style="display:flex; gap:20px">
                    <img src="./images/wind.png" width=15 height=10 />
                    <p>${windDeg} deg, ${windSpeed} spd</p>
                </div>
            </div>
            `
            // Append date/Icon and temp/humidity/wind to dayDivForecast
            dayDivForecast.append(forecastDate, forecastTemp);
            // Append each forecast item to the foreCastDays container
            foreCastDays.appendChild(dayDivForecast);
        });

    }
    catch (err) {
        // custom alert
        showAlert('Network error. Please try again.');
        console.error(err);
    }
}

// function to change background image according to weather
function setBgByWeatherId(main) {
    const bg = document.querySelector('.bgImg');

    if (main === "Mist")
        bg.style.backgroundImage = "url('./images/mist.jpg')";
    else if (main === 'Rain')
        bg.style.backgroundImage = "url('./images/rainy-forest.jpg')";
    else if (main === 'Snow')
        bg.style.backgroundImage = "url('./images/snow.jpg')";
    else if (main === 'Haze')
        bg.style.backgroundImage = "url('./images/haze.jpg')";
    else if (main === 'Clear')
        bg.style.backgroundImage = "url('./images/clear.jpg')";
    else
        bg.style.backgroundImage = "url('./images/cloudy.jpg')";
}

// Show custom alert for:- 1. Invalid city. 2. Empty Input. 3. Network Error etc...
function showAlert(message) {
    const divParent = document.createElement('div');
    divParent.classList.add('alertDiv');

    const divChild = document.createElement('div');
    divChild.classList.add('alertDivChild');

    const gif = document.createElement('img');
    gif.classList.add('gif');
    gif.src = message === 'Temperature is too High..' ? "./images/hot.png" : "./images/cry.gif";

    const p = document.createElement('p');
    p.innerText = ` ${message} `;

    divChild.appendChild(gif);
    divChild.appendChild(p);

    divParent.appendChild(divChild);
    document.body.appendChild(divParent);

    setTimeout(() => divParent.remove(), 3000);
}

// Fetch when user changes the city through search
findCity.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let city = findCity.value.trim();

        if (!city) return;
        // let searched_cities = JSON.parse(localStorage.getItem('searched_cities')) || [];     // This sometimes works and sometimes doesn't

        let searched_cities;
        // get the data from local storage named 'searched_cities' if not found then set it to empty array. If fail the try block then also set it to empty array
        try {
            searched_cities = JSON.parse(localStorage.getItem("searched_cities")) || [];

        } catch {
            searched_cities = [];
        }

        // Avoid duplicate and keep recent searches at the top
        // if (!searched_cities.includes(city)) {
        searched_cities = searched_cities.filter(e => e !== city)
        searched_cities.unshift(city);
        // }
        // keep only 5 searched cities
        searched_cities = searched_cities.slice(0, 5)
        localStorage.setItem('searched_cities', JSON.stringify(searched_cities))
        getSeachedCities()
        fetchWeather(city);
    }
});

getSeachedCities()
// function to create dropdown of searched cities
function getSeachedCities() {
    // First get the data from local storage
    const response = localStorage.getItem('searched_cities')
    let data;
    try {
        // if data, then parse it
        data = JSON.parse(response)
    } catch {
        // else set it to empty array
        data = []
    }

    // if the length of data is more than 0 then create dropdown
    if (data.length > 0) {
        const Dropdown = document.querySelector('#Dropdown')
        // Dropdown.classList.add('dropdown')
        const existingDropdown = document.querySelector('#cityDropdown');

        // To avoid multiple dropdowns on every function call
        if (existingDropdown) { existingDropdown.remove() };

        // Create dropdown
        const dropDown = document.createElement('select');
        dropDown.id = 'cityDropdown';

        // Default disabled option
        const defaultCity = document.createElement('option');
        defaultCity.textContent = 'select';
        defaultCity.value = '';
        defaultCity.selected = true;
        defaultCity.disabled = true;
        defaultCity.style.color = 'white'
        defaultCity.style.backgroundColor = 'gray'
        dropDown.appendChild(defaultCity);

        // if data is present then create options for each city
        data.forEach((e) => {
            const option = document.createElement('option');
            option.value = e;
            option.textContent = e;
            dropDown.appendChild(option)
        })
        console.log(data);
        // called input box to set its value whenever the dropdown changes
        const search = document.querySelector('#findCity');
        
        // whenever the value of select changes, set that value to input box
        dropDown.addEventListener('change', () => {
            search.value = dropDown.value;
            fetchWeather(dropDown.value)
        })
        // Append dropdown to Dropdown div which is in HTML file
        Dropdown.appendChild(dropDown)
        return;
    }

}


// Default city
fetchWeather('Delhi');
// document.addEventListener('DOMContentLoaded', () => {
//     const loader = document.getElementById('loader');
//     const app = document.getElementById('app');

//     setTimeout(() => {
//         loader.style.display = 'none';
//         app.classList.remove('hidden');

//         fetchWeather(); // run after loader
//     }, 2000);
// });

// const apiKey = 'my_API_key'
const apiKey = '0271dc5cc15767ab5d712f36bfc476c3'

const findCity = document.querySelector('#findCity')

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
    fetchWeather(currentCity);
});

let currentCity = "Delhi"
async function fetchWeather(city) {
    try {
        currentCity = city
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        // Alert if response is not right.
        if (!response.ok) {
            let errResponse = await response.json();
            showAlert(errResponse.message || 'City not found');
            return;
        }
        if (!forecastResponse.ok) {
            let errForecast = await forecastResponse.json();
            showAlert(errForecast.message || 'City not found');
            return;
        }
        const data = await response.json();
        const forecastData = await forecastResponse.json();
        console.log(data);

        // console.log(data.weather[0].main);
        // console.log(data.weather[0].description);
        // console.log(data.weather[0].icon);
        // console.log(data);

        // console.log(forecastData);
        // console.log(forecastData.list[0]);
        // console.log(forecastData.list[0].weather[0].main);
        // console.log(forecastData.list[0].weather[0].description);


        // let temp = data.weather[0].description
        let humid = data.main.humidity
        let prsr = data.main.pressure
        let temp = data.main.temp
        let windDeg = data.wind.deg
        let windSpeed = data.wind.speed
        // let City = data.name
        let icon = data.weather[0].icon
        let formatted = new Date().toLocaleString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        if ((unit === 'metric' && temp > 40) || (unit === 'imperial' && temp > 104)) {
            showAlert('Temperature is too High..')
        }

        // URL for icon of the weather
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

        // console.log(temp);
        // console.log(City);
        setBgByWeatherId(data.weather[0].main);

        // Time & Date/Month/Year
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

        //     findCity.addEventListener('change', ()=>{        // Have to remove
        //     city = findCity.value     
        // })
        const foreCastDays = document.querySelector('#weatherForecast');
        foreCastDays.innerHTML = ''; // clear old forecast

        // Loop through first 5 forecast items (or any number you want)
        forecastData.list.slice(0, 5).forEach(item => {
            // const dayDiv = document.createElement('div');     // Have to remove
            // dayDiv.classList.add('forecastDetail');
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

            // Create content                                   // Have to remove
            //         dayDivForecast.innerHTML = `
            //     <div>
            //     <p>${date}</p>
            //     <img src="${iconUrl}" alt="${main}" />
            //     </div>
            //     <div>
            //     <p>${temp}°C</p>
            //     <p>${main}</p>
            //     </div>
            // `;
            forecastDate.innerHTML = `
            <p>${date}</p>
            <img src="${iconUrl}" width='50px' alt="${main}" />
            `;
            // <p>${main}</p>
            forecastTemp.innerHTML = `
                <p>${temp} °C</p>
                <p>${humidity} %</p>
                <p>${windDeg} deg, ${windSpeed} spd</p>
            `
            // dayDiv.appendChild(dayDivForecast)
            dayDivForecast.append(forecastDate, forecastTemp);
            foreCastDays.appendChild(dayDivForecast);
            // foreCastDays.appendChild(dayDiv);
        });

    }
    catch (err) {
        showAlert('Network error. Please try again.');
        console.error(err);
    }
}

// Weather Background Image
function setBgByWeatherId(main) {
    const bg = document.querySelector('.bgImg');
    // console.log(main);

    if (main === "Mist")
        bg.style.backgroundImage = "url('./images/mist.jpg')";
    else if (main === 'Rain')
        bg.style.backgroundImage = "url('./images/rainy-forest.jpg')";
    else if (main === 'Snow')
        bg.style.backgroundImage = "url('./images/snow.jpg')";
    else if (main === 'Haze')
        bg.style.backgroundImage = "url('./images/haze1.jpg')";
    else if (main === 'Clear')
        bg.style.backgroundImage = "url('./images/clear.jpg')";
    else
        bg.style.backgroundImage = "url('./images/cloudy.jpg')";
}

// Show alert for:- 1. Invalid city. 2. Empty Input. 3. Network Error
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

// Fetch when user changes the city
findCity.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let city = findCity.value.trim();
        
        if (!city) return ;
        // let searched_cities = JSON.parse(localStorage.getItem('searched_cities')) || [];     // This sometimes works and sometimes don't
       
        let searched_cities;
        try {
            searched_cities = JSON.parse(localStorage.getItem("searched_cities")) || [];

        } catch {

            searched_cities = [];
        }
        // if (!searched_cities.includes(city)) {
        searched_cities=searched_cities.filter(e=> e!==city)    
        searched_cities.unshift(city);
        // }
        searched_cities = searched_cities.slice(0,5)
        localStorage.setItem('searched_cities', JSON.stringify(searched_cities))
        getSeachedCities()
        fetchWeather(city);
    }
});
getSeachedCities()
function getSeachedCities() {
    const response = localStorage.getItem('searched_cities')
    let data;
    try {
        data = JSON.parse(response)
    } catch {
        data = []
    }
    if (data.length > 0) {
        // const input = document.querySelector('#findCity');
        const Dropdown = document.querySelector('#Dropdown')
        // Dropdown.classList.add('dropdown')
        const existingDropdown = document.querySelector('#cityDropdown');
        if (existingDropdown) { existingDropdown.remove() };
        const dropDown = document.createElement('select');
        dropDown.id = 'cityDropdown';

        const defaultCity = document.createElement('option');
        defaultCity.textContent = 'select';
        defaultCity.value = '';
        defaultCity.selected = true;
        defaultCity.disabled = true;
        defaultCity.style.color = 'white'
        defaultCity.style.backgroundColor = 'gray'
        // defaultCity.style.width = '100%'
        // defaultCity.style.height = '100%'
        dropDown.appendChild(defaultCity);
        data.forEach((e) => {
            const option = document.createElement('option');
            option.value = e;
            option.textContent = e;
            dropDown.appendChild(option)
        })
        console.log(data);
        const search = document.querySelector('#findCity');
        dropDown.addEventListener('change', () => {
            search.value = dropDown.value;
            fetchWeather(dropDown.value)
        })
        Dropdown.appendChild(dropDown)
        // input.insertAdjacentElement('afterend',dropDown)
        return;
    }
    // const dropDown = document.createElement('select');
    // dropDown.innerHTML = `
    // <select>
    // <option>${data[0]}</option>
    // <option>${data[1]}</option>
    // <option>${data[2]}</option>
    // <option>${data[3]}</option>
    // <option>${data[4]}</option>
    // </select>
    // `
    // input.appendChild(dropDown)
    // document.body.appendChild(input)
}


// Default city
fetchWeather('Delhi');
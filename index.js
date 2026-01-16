// document.addEventListener('DOMContentLoaded', () => {
//     const loader = document.getElementById('loader');
//     const app = document.getElementById('app');

//     setTimeout(() => {
//         loader.style.display = 'none';
//         app.classList.remove('hidden');

//         fetchWeather(); // run after loader
//     }, 2000);
// });

const apiKey = 'my_API_key'

const findCity = document.querySelector('#findCity')


// Tomorrow work on this
// function unit(){
//     const btn = document.createElement('button')
//     btn.addEventListener('click', ()=>{
//         // use metric for celcius and imperial for fahraniet
//        units= units=metric? units=imperial: units=metric
//     })
// }
// unit();

async function fetchWeather(city) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        const data = await response.json();
        console.log(data);

        // Alert if response is not right.
        if (!response.ok) {
            showAlert(data.message || 'City not found');
            return;
        }

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


        // URL for icon of the weather
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

        // console.log(data.weather[0].main);
        // console.log(data.weather[0].description);
        // console.log(data.weather[0].icon);
        // console.log(data);
        // console.log(temp);
        // console.log(City);

        // Time & Date/Month/Year
        const day = document.querySelector('#currentDate')
        day.innerText = formatted
        // Temprature
        const temprature = document.querySelector('#temp')
        temprature.innerText = `${temp} °C`
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

        //     findCity.addEventListener('change', ()=>{
        //     city = findCity.value     
        // })
    }
    catch (err) {
        showAlert('Network error. Please try again.');
        console.error(err);
    }
}

// Show alert for:- 1. Invalid city. 2. Empty Input. 3. Network Error
function showAlert(message) {
    // document.querySelector('.alertDiv')?.remove();

    const div = document.createElement('div');
    div.classList.add('alertDiv')

    const p = document.createElement('p');
    div.innerText = message;

    div.appendChild(p);
    document.body.appendChild(div);
    console.log('showAlert called:', message);

    setTimeout(() => div.remove(), 3000);
}


// Fetch when user changes city
findCity.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = findCity.value.trim();

        fetchWeather(city);
    }
});


// Default city
fetchWeather('Delhi');
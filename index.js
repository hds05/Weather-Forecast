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
// const city = document.querySelector('#findCity')
// city.addEventListener('input', (e)=>{
//     let namee= city.innerText = e.target.value
//     console.log(namee);
    
// })
const city = 'haryana'
async function fetchWeather() {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    const data = await response.json();
    // let temp = data.weather[0].description
    let humid = data.main.humidity
    let prsr = data.main.pressure
    let temp = data.main.temp
    let cityName = data.name
    let icon = data.weather[0].icon

    // URL for icon of the weather
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
    
    console.log(data.weather[0].main);
    console.log(data.weather[0].description);
    console.log(data.weather[0].icon);
    console.log(data);
    console.log(temp);
    console.log(cityName);
    
    // Temprature
    const temprature = document.querySelector('#temp')
    temprature.innerText = `${temp} C`
    // Icon
    const iconWeather = document.querySelector('#iconWeather')
    // console.log(iconUrl)
    iconWeather.src = iconUrl
    // Find city 
    const findCity = document.querySelector('#cityName')
    findCity.innerText = cityName
    // Humidity
    const humidity = document.querySelector('#humidity')
    humidity.innerText = `Humidity:- ${humid}`
    // Pressure
    const pressure = document.querySelector('#pressure')
    pressure.innerText = `Pressure:- ${prsr}`
}
fetchWeather();

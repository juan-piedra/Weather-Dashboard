const APIKey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
const cityName = document.getElementById('CurrCity');
const cityTemp = document.getElementById('CurrTemp');
const cityWind = document.getElementById('CurrWind');
const cityHumidity = document.getElementById('CurrHumidity');
let currDate = new Date();

document.getElementById('SearchButton').addEventListener('click', function() {
    const searchValue = document.getElementById('Search').value;
    geoCode(searchValue);
    addToSearchHistory(searchValue);
})


const geoCode = (searchValue) => {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${APIKey}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        getCurr(data[0].lat, data[0].lon)
        getForecast(data[0].lat, data[0].lon)
    })
}

const getCurr = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        // Append currDay to HTML
        cityName.innerText = data.name+' ('+currDate.toLocaleDateString()+')';
        // Append currWeather to HTML
        cityTemp.innerText = 'Temp: '+data.main.temp;
        cityWind.innerText = 'Wind: '+data.wind.speed+' MPH'
        cityHumidity.innerText = 'Humidity: '+data.main.humidity+'%'
        // Append currIcon to HTML

        let icon = document.createElement('img')
        icon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        document.getElementById('WeatherIcon').innerHTML = ''
        document.getElementById('WeatherIcon').append(icon);
    })
}

const getForecast = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        
        for (i = 0; i < 5; i++){
            console.log(data.list[3+(i*8)].main.temp)
            // Dates
            const forecastDay = document.getElementById(`Day${i}`)
            let futureDates = new Date();
            futureDates.setDate(futureDates.getDate() + (i+1));
            forecastDay.innerText = '('+futureDates.toLocaleDateString()+')';
            // Icons
            document.getElementById(`Icon${i}`).innerHTML = ''
            const forecastIcon = document.createElement('img');
            forecastIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.list[3+(i*8)].weather[0].icon}@2x.png`)
            document.getElementById(`Icon${i}`).append(forecastIcon);
            // Temp
            const forecastTemp = document.getElementById(`Temp${i}`)
            const futureTemps = data.list[3+(i*8)].main.temp;
            forecastTemp.innerText = 'Temp: '+futureTemps;
            // Wind
            const forecastWind = document.getElementById(`Wind${i}`);
            const futureWinds = data.list[3+(i*8)].wind.speed;
            forecastWind.innerText = 'Wind: '+futureWinds+' MPH'
            // Humidity
            const forecastHumidity = document.getElementById(`Humidity${i}`);
            const futureHumidities = data.list[3+(i*8)].main.humidity;
            forecastHumidity.innerText = 'Humidity: '+futureHumidities+'%'
        }
    })    
}

const addToSearchHistory = (searchValue) => {
    let newListItem = document.createElement('li');
    newListItem.setAttribute('class', 'list-group-item list-group-item-action list-group-item-light')
    newListItem.addEventListener('click', function() {
        geoCode(searchValue);
    });
    newListItem.innerText = searchValue;
    document.getElementById('SearchHistory').appendChild(newListItem);
}
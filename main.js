const API_URL = "https://api.openweathermap.org/data/3.0/onecall";
const APP_ID = "081f509558a6fc29897d26c964840013";

// Weather state object
let weatherData = {
    city: '',
    temperature: 0,
    currentCondition: '',
    currentIcon: '',
}

const setWeatherData = async (data) => {
    weatherData = {
        ...weatherData,
        temperature: data.main.temp,
        city: data.name,
        currentCondition: data.weather[0].description,
        currentIcon: data.weather[0].icon,
    }

    // window.localStorage.setItem(userData.zip, JSON.stringify(weatherData))
}

const validateZipCode = (value) => {
    if (!isNaN(value) && value.length === 5) {
        return true;
    }

    return false;
}

// Cancel run of the function passed in if it's fired again within timeframe
const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

let userData = {
    zip: ''
}

const handleZipInputChange = async (e) => {
    const zip = e.target.value;
    const zipValid = validateZipCode(zip);

    if (zipValid) {
        userData.zip = zip;
        let data = await getWeatherByZipcode(zip);
        await setWeatherData(data);
        setPage(true);
    } else {
        setPage(false)
    }

}

// set a keydown event listener on the element.
document.getElementById('userZipCode').addEventListener('keydown', debounce(handleZipInputChange))

// Call the API with a zip code.
const getWeatherByZipcode = async (zipcode) => {
    try {
        page.errorVisible = false;

        let options = {
            params: {
                lat: 36.4761,
                lon: -119.4432,
                appid: APP_ID,
            }
        }

        let response = await axios.get(API_URL, options)
        console.log(response.data);
        
        if (response.data) {
            return response.data;
        }
    } catch (err) {
        // TODO: Handling errors with the api call
        console.log(err)
    }
}

// Page State to inform the visibility of the elements
// and other stateful pieces of page.
let page = {
    errorVisible: false,
    contentVisible: false,
}

// Grab all the divs for later use.
let errorDiv = document.getElementById('alert');
let weatherDiv = document.getElementById('weatherContainer');
let cityDiv = document.getElementById('city');
let currentConditionsDiv = document.getElementById('currentConditions');
let temperatureDiv = document.getElementById('temperature');
let currentIconDiv = document.getElementById('currentIcon');

// Set the page state.
const setPage = (show) => {
    page = {
        ...page,
        contentVisible: show,
    }
    
    if (page.contentVisible) {
        setBackgroundColor(weatherData.currentCondition)
        currentIconDiv.src = `https://openweathermap.org/img/wn/${weatherData.currentIcon}@4x.png`;
        cityDiv.textContent = weatherData.city;
        currentConditionsDiv.textContent = weatherData.currentCondition;
        temperatureDiv.textContent = weatherData.temperature;
        weatherDiv.style.opacity = 1;
    } else {
        weatherDiv.style.opacity = 0;
    }
}

const backgroundColors = {
    'overcast clouds': 'gray',
    'rain': 'darkblue',
    'clear sky': 'lightblue',
    'tornado': 'rainbow',
    'snow': 'white',
}

const setBackgroundColor = (condition) => {
    // document.querySelector('body').classList = condition.replace(' ', '');
    document.querySelector('body').style.backgroundColor = backgroundColors[condition];
}
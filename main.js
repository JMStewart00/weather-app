// Project Constants
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const APP_ID = "081f509558a6fc29897d26c964840013";

// Grab all the variables for divs for later use.
let errorDiv, weatherDiv, cityDiv, currentConditionsDiv, temperatureDiv, currentIconDiv;

// Weather state object
let weatherData = {
    city: '',
    temperature: 0,
    currentCondition: '',
    currentIcon: '',
}

// User Data Object
let userData = {
    zip: '',
}

// Page State to inform the visibility of the elements
// and other stateful pieces of page.
let page = {
    errorVisible: false,
    contentVisible: false,
}

// Background lookup
const backgroundColors = {
    'overcast clouds': 'gray',
    'rain': 'darkblue',
    'clear sky': 'lightblue',
    'tornado': 'rainbow',
    'snow': 'white',
}

// A setter for the weather data.
const setWeatherData = (data) => {
    // Instead of updating the state in place and mutating state
    // it's common to see state updated by taking a deconstructed version
    // of the current state ...weatherData and updating the values with new
    // ones to make anew version state rather than mutate the original.
    // State is generally IMMUTABLE.

    weatherData = {
        ...weatherData,
        temperature: data.main.temp,
        city: data.name,
        currentCondition: data.weather[0].description,
        currentIcon: data.weather[0].icon,
    }
}

const validateZipCode = (value) => {
    if (!isNaN(value) && value.length === 5) {
        return true;
    }

    return false;
}

// Cancel run of the function passed in if it's fired again within a certain timeframe.
// This concept is referred to as DEBOUNCE
const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Event Handler for when the input changes.
const handleZipInputChange = async (e) => {
    const zip = e.target.value;
    const zipValid = validateZipCode(zip);

    if (zipValid) {
        userData.zip = zip;
        let data = await getWeatherByZipcode(zip);
        if (data) {
            setWeatherData(data);
            setPage(true);
        }
    } else {
        setPage(false)
    }

}

// Call the API with a zip code.
const getWeatherByZipcode = async (zipcode) => {
    try {
        page.errorVisible = false;
        errorDiv.style.display = 'none';

        // Declare API call options in an objects to help maintainability.
        // Params get appended to the url in the axios call by looping over them
        // and setting the key, value pairs as key=value after the ? (query string)
        let options = {
            params: {
                zip: zipcode,
                appid: APP_ID,
            }
        }

        let response = await axios.get(API_URL, options)
        
        // only return a response if there is data, otherwise there is no data
        // returned and this results in undefined.
        if (response.data) {
            return response.data;
        }
    } catch (err) {
        errorDiv.textContent = err.response.data.message + ', Please Try Again.';
        errorDiv.style.display = 'block';
    }
}

// Set the page state.
const setPage = (show) => {
    // Update the page state to true/false
    page = {
        ...page,
        contentVisible: show,
    }
    
    if (show) { // if show is true
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

const setBackgroundColor = (condition) => {
    // use the backgroundColors lookup to set the body background color
    document.body.style.backgroundColor = backgroundColors[condition];
}

// Object passed as the single paramter to help set both named parameters
// that are optional and provide defaults values. Each key can be used as a
// local variable in the function.
const renderElement = ({
    id = '',
    classes = [],
    tag = 'div',
}) => {
    let element = document.createElement(tag);

    if (id) {
        element.setAttribute('id', id);
    }

    // Checking array length to only set classes if one exists.
    if (classes.length > 0) {
        classes.forEach((klass) => { // class is a reserved word, so it's necessary to use klass
            element.classList.add(klass);
        })
    }

    return element;
}

// pass an element and an object.
// Loop through the object and assign attributes and values
// based on key, value pairs.
const setMiscAttributes = (el, obj) => {
    for (const [key, value] of Object.entries(obj)) {
        el.setAttribute(key, value);
    }
}

const init = () => {
    let root = document.getElementById('root');

    let div = renderElement({
        classes: ['row', 'justify-content-center', 'p-3']
    })

    let input = document.createElement('input');
    setMiscAttributes(input, {
        type: 'text',
        id: 'userZipCode',
        placeholder: '#####',
        pattern: '[0-9]{5}',
    })

    errorDiv = renderElement({
        classes: ['alert', 'alert-danger', 'mt-3'],
        id: 'alert',
    })
    setMiscAttributes(errorDiv, { role: 'alert', style: 'display: none; text-transform: capitalize;' });
        
    root.appendChild(div);
    div.append(input, errorDiv);

    // set a keydown event listener on the element.
    input.addEventListener('keyup', debounce(handleZipInputChange));

    weatherDiv = renderElement({ id: 'weatherContainer '});
    root.appendChild(weatherDiv);

    let elements = [ 'city', 'currentConditions', 'temperature' ];
    elements.forEach((id) => {
        let div = document.createElement('div');
        div.classList.add(...['row', 'justify-content-center', 'p-3']);
        weatherDiv.appendChild(div);

        let propElement = document.createElement('div');
        propElement.setAttribute('id', id);
        propElement.setAttribute('class', 'text-center');
        div.appendChild(propElement);

        if (id === 'temperature') {
            let extraDiv = document.createElement('div');
            extraDiv.classList.add(...['col', 'text-center']);
            div.appendChild(extraDiv);
            currentIconDiv = document.createElement('img');
            currentIconDiv.setAttribute('id', 'currentIcon');
            extraDiv.appendChild(currentIconDiv);
        }
    })

    cityDiv = document.getElementById('city');
    currentConditionsDiv = document.getElementById('currentConditions');
    temperatureDiv = document.getElementById('temperature');
}

document.body.onload = init;
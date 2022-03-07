const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const APP_ID = "380906d123b7d6653989ff66f7fe4c66";

// Model - Only the data
class Weather {
    constructor() {
        this.city = '';
        this.temperature = 0;
        this.currentCondition = '';
        this.currentIcon = '';
    }

    setWeather(x) {
        this.city = x.city;
        this.temperature = x.temperature;
        this.currentCondition = x.currentCondition;
        this.currentIcon = x.currentIcon;
    }

    setCity(x) {
        this.city = x;
    }

    getCity() {
        return this.city;
    }

    setTemperture(x) {
        this.temperature = x;
    }

    getTemperture() {
        return this.temperature;
    }

    setCurrentConditions(x) {
        this.currentConditions = x;
    }

    getCurrentConditions() {
        return this.currentIcon;
    }

    setCurrentIcon(x) {
        this.currentIcon = x;
    }

    getCurrentIcon() {
        return this.currentIcon;
    }
}

// Controller
// new WeatherController(Weather, WeatherView)
class WeatherController {
    constructor(model, view) {
        this.m = model;
        this.v = view;

        this.v.bindInputChange(this.handleZipInputChange.bind(this));
    }

    async getWeatherByZipcode(zip) {
        try {
            let response = await axios.get(`${API_URL}?zip=${zip}&appid=${APP_ID}`)
            if (response.data){
                return response.data;
            }
        } catch (error) {
            console.log(error)
        }
    }

    validateZipCode(value) {
        if (!isNaN(value) && value.length === 5) {
            return true
        }

        return false
    }

    // Does this go in the controller?
    async handleZipInputChange(e) {
        const value = e.target.value;
        const validZip = this.validateZipCode(value);
        if (validZip) {
            let data = await this.getWeatherByZipcode(value);

            this.m.setWeather({
                temperature: data.main.temp,
                city: data.name,
                currentCondition: data.weather[0].description,
                currentIcon: data.weather[0].icon,
            })

            this.v.displayWeather(this.m);
        }

    }
}

// View 
class WeatherView {
    constructor() {
        // Grab all the divs for later use.
        this.input = document.getElementById('userZipCode');
        this.errorDiv = document.getElementById('alert');
        this.weatherDiv = document.getElementById('weatherContainer');
        this.cityDiv = document.getElementById('city');
        this.currentConditionsDiv = document.getElementById('currentConditions');
        this.temperatureDiv = document.getElementById('temperature');
        this.currentIconDiv = document.getElementById('currentIcon');
    }

    bindInputChange(fn) {
        this.input.addEventListener('input', fn)
    }

    displayWeather(model) {
        this.cityDiv.textContent = model.getCity();
        this.currentConditionsDiv.textContent = model.getCurrentConditions();
        this.temperatureDiv.textContent = model.getTemperture();
        this.currentIconDiv.src = `https://openweathermap.org/img/wn/${model.getCurrentIcon()}@4x.png`;
    }
}


// Create event handler in the CONTROLLER.
// create binder function in view that accepts argument fn from controller
// Come back to the CONTROLLER and instantiate it in the contructor (BECAUSE WE HAVE ACCESS TO THE VIEW)

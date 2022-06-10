// Create a new date instance dynamically with JS
let d = new Date();
let newTime = d.getHours() + " : " + d.getMinutes();
const newDate = d.toDateString();


/* Global Variables */
const generateBtn = document.getElementById("generateBtn"),
      zipCode = document.getElementById("zipCode"),
      feeling = document.querySelector("#feeling"),
      feelingOutput = document.querySelector("#feeling-output"),
      weatherIcon = document.querySelector(".weather-icon"),
      temperature = document.querySelector(".temperature"),
      timeDate = document.querySelector(".time-date"),
      weatherCondition = document.querySelector(".weather-condition"),
      detailValues = document.getElementsByClassName("detail-value"),
      cityName = document.querySelector(".city-name");


// API Variables
const primaryURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=34985d864351823b9ebb9ace0b38a706&units=imperial';


//Event Listener function for the generate button
generateBtn.addEventListener("click", (evt) => {
    evt.preventDefault(); //prevents the form from submitting itself and refreshing the page
    const dynamicURL = `${primaryURL}${zipCode.value}${apiKey}`;//url generator
    collectData(dynamicURL) //collects the data from the OpenWeatherMap API
        .then((data) => {
            collateData(data) //Callback function that extracts only the required data
                .then((info) => {
                    sendData("/add", info) //Call function that converts the data to JSON and sends it to the server
                        .then(() => {
                            retrieveData("/all") //Callback function that retrieves the data from the server
                                .then((data) => {
                                    updateInterface(data); //Updates the interface with the data asynchronously
                                });
                        });
                });
        });
});

//Async function that collects the data from the OpenWeatherMap API
const collectData = async (url) => {
    try {
        const result = await fetch(url);
        const data = await result.json();
        if (data.cod === 200) {
            return (data);
        }
    }
    catch (err) {
        console.error("Error found : " + err);
    }
}

//Async function that extracts only the required data
const collateData = async (data) => {
    await data;
    try {
        if (data) {
            const icon = data.weather[0].icon;
            const mainWeather = data.weather[0].main;
            const info = {
                date: newDate,
                time: newTime,
                feeling: feeling.value,
                temperature: `${Math.round(data.main.temp)}°`,
                weather: data.weather[0].description,
                icon: icon,
                mainWeather: mainWeather,
                humidity: `${data.main.humidity}%`,
                pressure: `${data.main.pressure}pa`,
                wind: `${data.wind.deg}°`,
                name: data.name
            }
            return (info);
        }
        else {
            return data;
        };
    }
    catch (err) {
        console.error("Error found" + err);
    }
};

//Async function that converts the data to JSON and sends it to the server
const sendData = async (url = "", data = {}) => {
    try {
        const value = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return value;
    }
    catch (err) {
        console.error("Error found " + err)
    }
}

//Async function that retrieves data from the server
const retrieveData = async (url) => {
    const data = await fetch(url);
    try {
        const res = await data.json();
        return res;
    }
    catch (err) {
        console.error("Error found " + err);
    }
}

//Async function that updates the browser interface with the data dynamically
const updateInterface = async (data) => {
    try {
        const response = await data;
        if (response.date) {
            const mainWeather = response.mainWeather;
            timeDate.innerText = `${response.time} - ${response.date}`;
            temperature.innerText = response.temperature;
            feelingOutput.innerText = response.feeling;
            weatherCondition.innerText = response.weather;
            cityName.innerText = response.name;
            detailValues[0].innerText = response.humidity;
            detailValues[1].innerText = response.wind;
            detailValues[2].innerText = response.pressure;
            imageInverter(mainWeather); //it changes the background image of the page according to data received
        } else {
            alert("Input Error!\nCheck zip code and try again...")
        }
    }
    catch (err) {
        console.error("Error : " + err);
    }
}

//Async function that changes the background image of the page according to data received
const imageInverter = async (mainWeather) => {
    await mainWeather;
    let body = document.body;
    if (mainWeather === "Clear") {
        body.style.cssText = `background: url(./img/sunny-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/sun.png";
    } else if (mainWeather === "Rain") {
        body.style.cssText = `background: url(./img/rainy-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/rain.png";
    } else if (mainWeather === "Storm") {
        body.style.cssText = `background: url(./img/stormy-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/storm.png";
    } else if (mainWeather === "Snow") {
        body.style.cssText = `background: url(./img/snowy-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/snow.png";
    } else if (mainWeather === "Haze" || mainWeather === "Mist") {
        body.style.cssText = `background: url(./img/misty-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/mist.png";
    } else if (mainWeather === "Wind") {
        body.style.cssText = `background: url(./img/windy-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/wind.png";
    } else if (mainWeather === "Clouds") {
        body.style.cssText = `background: url(./img/cloudy-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/cloud.png";
    } else {
        body.style.cssText = `background: url(./img/sample-bg.jpg) no-repeat fixed center;
        background-size: cover;`
        weatherIcon.src = "./ico/sample.png";
    }
}
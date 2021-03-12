// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const windSpeedElement = document.querySelector(".wind-speed-text");
const windDirectionElement = document.querySelector(".wind-direction-text");
const MainWrapper = document.getElementById("days");

// App data
const weather = {};

const getDay = () => {
  var options = { weekday: "long", day: "numeric" };
  var today = new Date();

  return today.toLocaleDateString("en-US", options);
};

weather.temperature = {
  unit: "celsius",
};

const KELVIN = 273;

const key = "d2bd1e31ad84f3b9a361e9a9a396d3ee";

const setPosition = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
};
//Funckija vo slucaj da ima error
const showError = (error) => {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
};
// Funkcija koja ja zemav od set-upot za ova API,
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

const createDayElement = (
  parentElem,
  wrapperId,
  elemId,
  text,
  cssClass,
  elemType,
  src
) => {
  let elemWrapper = document.createElement("div");
  elemWrapper.setAttribute("id", wrapperId);
  elemWrapper.setAttribute("class", "elem-wrapper");
  parentElem.appendChild(elemWrapper);
  let getElementWrapper = document.getElementById(wrapperId);

  let elemContent = document.createElement(elemType);
  elemContent.setAttribute("id", elemId);
  elemContent.setAttribute("class", cssClass);
  if (elemType === "img") {
    elemContent.setAttribute("src", src);
  }
  getElementWrapper.appendChild(elemContent);
  if (elemType !== "img") document.getElementById(elemId).innerHTML = text;
};

const createDivwrapper = (id, dayID) => {
  //Da imav info od APIto za poise denovi na click ke povikuase Callback i ke go podavase dayID kako argument
  let divWrapper = document.createElement("div");
  divWrapper.setAttribute("class", "div-wrapper");
  divWrapper.setAttribute("id", id);
  divWrapper.addEventListener("click", () => displayWeather()); //
  MainWrapper.appendChild(divWrapper);
};

const htmlElems = ["h4", "p", "p", "img"];
const styles = ["city-style", "day-style", "temp-style", "icon-style"];
const getUniqueID = () => {
  return Math.floor(Math.random() * Math.floor(1000000));
};

//Dinamicki generira HTML Elementi
const generateDays = () => {
  //Deka ne mozev da najdam API so ke pokazuva za poise denovi unapred morav da simuliram
  //Kako bi izglealo koga bi imal
  let prox_arr = [1, 2, 3, 4, 5];
  for (let elem of prox_arr) {
    let assingID = getUniqueID().toString();
    createDivwrapper(assingID);
    let divWrapper = document.getElementById(assingID);
    for (let i = 0; i < 4; i++) {
      if (i === 0) text = weather.city;
      else if (i === 1) text = weather.day;
      else if (i === 2) text = weather.temperature;
      createDayElement(
        divWrapper,
        getUniqueID(),
        getUniqueID(),
        text,
        styles[i],
        htmlElems[i],
        weather.iconId
      );
    }
  }
};

// Funkcija koja prakja API CALL
const getWeather = (latitude, longitude) => {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      console.log(data);
      weather.day = getDay();
      weather.temperature = Math.floor(data.main.temp - KELVIN);
      weather.temperatureUnit = "fahrenheit";
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.windSpeed = data.wind.speed;
      weather.windDirection = data.wind.deg;
    })
    .then(() => {
      generateDays();
      displayWeather();
    });
};

// Funkcija koja gi prikazuva informaciite vo widgetot
const displayWeather = (dayID) => {
  //Da imam Api so ke mi dava za poise denovi spored dayID ke gi prikazuva informaciite dole
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
  windSpeedElement.innerHTML = `${weather.windSpeed}`;
  windDirectionElement.innerHTML = `${weather.windDirection} ∘`;
};

// Celzius vo Farenhajt konverzija
const celsiusToFahrenheit = (temperature) => {
  return (temperature * 9) / 5 + 32;
};

// Funkcija za konveritranje koga userot ke klikne
tempElement.addEventListener("click", () => {
  if (weather.temperature === undefined) return;

  if (weather.temperatureUnit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperatureUnit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature}°<span>C</span>`;
    weather.temperatureUnit = "celsius";
  }
});

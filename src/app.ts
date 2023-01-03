const backend = "http://127.0.0.1:3000";

const cityInput = document.querySelector(".cityInput") as HTMLInputElement;
const searchButton = document.querySelector(
  ".submitButton"
) as HTMLButtonElement;
const getCurrentLocationButton = document.querySelector(
  ".getCurrentLocationButton"
) as HTMLButtonElement;
const weatherImage = document.querySelector(
  ".weather__temperature_mid_icon"
) as HTMLImageElement;
const weatherBox = document.querySelector(
  ".weather__temperature"
) as HTMLElement;
const weatherDescription = document.querySelector(
  ".weather__temperature_mid_description"
) as HTMLParagraphElement;
const displayTemperatureCelsius = document.querySelector(
  ".weather__temperature_bottom_right_celsius"
) as HTMLParagraphElement;
const displayTime = document.querySelector(
  ".weather__temperature_top_time"
) as HTMLParagraphElement;
const displayCity = document.querySelector(
  ".weather__temperature_top_city"
) as HTMLParagraphElement;
const displayHumidity = document.querySelector(
  ".weather__temperature_bottom_left_humidity"
) as HTMLParagraphElement;
const displayWind = document.querySelector(
  ".weather__temperature_bottom_left_wind"
) as HTMLParagraphElement;
const airQualityDisplay = document.querySelector(
  ".weather__air__quality"
) as HTMLDivElement;
const displayLowestTemperatureCelsius = document.querySelector(
  ".weather__temperature_bottom_right_lowest"
) as HTMLParagraphElement;
const displayHighestTemperatureCelsius = document.querySelector(
  ".weather__temperature_bottom_right_highest"
) as HTMLParagraphElement;

const getCityTime = async (lat: number, long: number) => {
  const printAddress = async (arr) => {
    const a = await arr;
    displayTime.textContent = a;
  };
  const arr: Object[] = [];
  const rest = await fetch(`${backend}/timezone?long=${long}&lat=${lat}`);
  const obj: any = await rest.json();
  const time = obj.time_24;
  arr.push(time.slice(0, 5));
  return printAddress(arr);
};

const updateFromData = (obj) => {
  const longitude = obj.coord.lon;
  const latitude = obj.coord.lat;
  const wind = obj.wind.speed;
  const cityName = obj.name;
  const icon = obj.weather[0].icon;
  const description = obj.weather[0].description;
  const humidity = obj.main.humidity;
  const mainTemp = Math.floor(obj.main.temp).toString();
  const minTemp = Math.floor(obj.main.temp_min).toString();
  const maxTemp = Math.floor(obj.main.temp_max);
  weatherImage.src = `https://openweathermap.org/img/wn/${icon}@4x.png `;
  displayCity.textContent = cityName;
  weatherDescription.textContent = description;
  displayHumidity.textContent = humidity;
  displayWind.textContent = wind;
  displayTemperatureCelsius.textContent = `${mainTemp} °C`;
  displayLowestTemperatureCelsius.textContent = `L: ${minTemp} °C`;
  displayHighestTemperatureCelsius.textContent = `H: ${maxTemp} °C`;
  weatherBox.classList.add("weather__temperature-Active");
  airQualityDisplay.classList.add("weather__air__quality-Active");
  airQualityDisplay.setAttribute(
    "src",
    `https://airly.org/widget/v2/?displayMeasurements=false&displayCAQI=true&autoHeight=true&autoWidth=false&language=en&indexType=AIRLY_CAQI&unitSpeed=metric&unitTemperature=celsius&latitude=${latitude}&longitude=${longitude}`
  );
  getCityTime(latitude, longitude);
};

const getWeatherByInput = async (searchtext: any = cityInput.value) => {
  searchtext =
    !searchtext || searchtext.length <= 0 || typeof searchtext != "string"
      ? cityInput.value
      : searchtext;
  const url = await fetch(`${backend}/weather?city=${searchtext}`);
  try {
    updateFromData(await url.json());
  } catch (err: any) {
    return { Error: err.stack };
  }
};

const getWeatherByLocation = async (lat: number, lon: number) => {
  const url = await fetch(`${backend}/byLocation?lat=${lat}&lon=${lon}`);
  try {
    updateFromData(await url.json());
  } catch (err: any) {
    return { Error: err.stack };
  }
};

const getCurrentLocation = () => {
  const succes = (pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    getWeatherByLocation(latitude, longitude);
  };
  const error = (err) => console.log(err);
  navigator.geolocation.getCurrentPosition(succes, error);
};

getCurrentLocationButton.addEventListener("click", getCurrentLocation);

searchButton.addEventListener("click", getWeatherByInput);

cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getWeatherByInput(cityInput.value)
);

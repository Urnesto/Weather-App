import React, { useState, useEffect } from "react";
import axios from "axios";
import cities from "cities.json";
import { search } from "../assets";

function WeatherApp() {
  const [city, setCity] = useState(""); // Set the default city to Vilnius
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDataHourly, setWeatherDataHourly] = useState(null);
  const openWeatherMapApiKey = "00977a670ee091ecbe8dbfff0a085450"; // Your OpenWeatherMap API key

  const handleCitySearch = (inputCity) => {
    setCity(inputCity);

    const matchingCities = cities
      .filter((c) => c.name.toLowerCase().includes(inputCity.toLowerCase()))
      .slice(0, 4); // Limit to the top 4 matching cities

    setCitySuggestions(matchingCities);
  };

  const fetchWeatherData = (selectedCity) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.name}&appid=${openWeatherMapApiKey}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching OpenWeatherMap weather data:", error);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity.name}&appid=${openWeatherMapApiKey}&units=metric`
      )
      .then((response) => {
        setWeatherDataHourly(response.data);
      })
      .catch((error) => {
        console.error("Error fetching OpenWeatherMap weather data:", error);
      });

    setCitySuggestions([]);
  };

  useEffect(() => {
    fetchWeatherData({ name: "Vilnius" }); // Fetch weather data for Vilnius on component mount
  }, []);

  const getDayOfWeek = (timestamp) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return daysOfWeek[date.getUTCDay()]; // Get the day name
  };

  const getUniqueDayNames = () => {
    if (weatherDataHourly) {
      const dayNames = new Set();
      return weatherDataHourly.list.reduce((uniqueDayNames, data) => {
        const dayName = getDayOfWeek(data.dt);
        if (!dayNames.has(dayName)) {
          dayNames.add(dayName);
          uniqueDayNames.push(dayName);
        }
        return uniqueDayNames;
      }, []);
    }
    return [];
  };

  // Render unique day names once a week
  const uniqueDayNames = getUniqueDayNames();
  return (
    <div className="mx-auto w-11/12 max-w-7xl">
      <div>
        <div className="w-full rounded-lg border-0.5 border-neutrals-50/30 bg-neutrals-800/60 p-3 backdrop-blur-xl md:w-1/2">
          <label className="flex items-center">
            <img className="w-5 h-5" src={search} />
            <input
              className="mx-2 flex-1 bg-transparent outline-none text-neutrals-300 "
              type="text"
              placeholder="Enter a city"
              value={city}
              onChange={(e) => handleCitySearch(e.target.value)}
            />{" "}
          </label>

          <ul className=" flex w-full flex-col rounded-lg border-0.5 border-neutrals-50/30  ">
            {citySuggestions.map((suggestion) => (
              <li
                className="cursor-pointer rounded-sm py-1 px-2 text-neutrals-300 hover:bg-neutrals-800/60 "
                key={suggestion.geonameid}
                onClick={() => fetchWeatherData(suggestion)}
              >
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {weatherData && (
            <div className="my-10">
              <h1 className="text-neutrals-50 text-5xl font-bold">
                {" "}
                {weatherData.name} - {weatherData.sys.country}
              </h1>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-3">
            <div className="flex h-full flex-col rounded-2xl border-0.5 border-neutrals-50/30 bg-neutrals-800/60 p-6 backdrop-blur-xl">
              <h2 className="font-semibold leading-none text-neutrals-50  text-2xl">
                Weather forecast
              </h2>
              <hr className="my-4 border-neutrals-50/30" />
              <div className="grid auto-cols-max grid-flow-col divide-x-0.5 divide-neutrals-50/30 overflow-x-scroll pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutrals-300/70 scrollbar-thumb-rounded hover:scrollbar-thumb-neutrals-300/90">
                {uniqueDayNames.map((dayName) => (
                  <div className="relative px-2 lg:px-4" key={dayName}>
                    <span className="sticky left-0 font-display font-bold text-base text-neutrals-50">
                      {dayName}
                    </span>
                    <ul className="flex flex-1 gap-x-4 lg:gap-x-8 text-neutrals-50">
                      {weatherDataHourly &&
                        weatherDataHourly.list.map((data) => {
                          if (getDayOfWeek(data.dt) === dayName) {
                            return (
                              <li
                                key={data.dt}
                                className="flex flex-col items-center justify-between"
                              >
                                <p>{data.dt_txt.split(" ")[1]}</p>
                                <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="Weather Icon"
                                ></img>
                                <p>
                                  {data.main.temp}{" "}
                                  <span className=" text-xs">°C</span>
                                </p>
                              </li>
                            );
                          }

                          return null;
                        })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-3 md:col-span-1">
            <div className="w-full h-full bg-red-100">1</div>
          </div>
          <div className="col-span-3 md:col-span-2">
            {weatherData && (
              <div className="flex h-full flex-col rounded-2xl border-0.5 border-neutrals-50/30 bg-neutrals-800/60 p-6 backdrop-blur-xl text-neutrals-50">
                <h2 className="font-display font-semibold leading-none  text-2xl">
                  Additional conditions
                </h2>
                <hr className="my-4 border-neutrals-50/30" />
                <div className="grid h-full auto-rows-[1fr] grid-cols-2 gap-y-4">
                  <div>
                    <p className="font-semibold uppercase text-neutrals-400 text-xs">
                      Fells like
                    </p>
                    <p className="flex text-4xl lg:text-5xl">
                      {weatherData.main.temp}
                      <span className="ml-2 text-base">°C</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-neutrals-400 text-xs">
                      HUMIDITY
                    </p>
                    <p className="text-4xl lg:text-5xl">
                      {weatherData.main.humidity}
                      <span className="ml-2 text-base">%</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-neutrals-400 text-xs">
                      PRESSURE
                    </p>
                    <p className="text-4xl lg:text-5xl">
                      {weatherData.main.pressure}
                      <span className="ml-2 text-base">hPa</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-neutrals-400 text-xs">
                      FEELS LIKE
                    </p>
                    <p className=" flex text-4xl lg:text-5xl">
                      {weatherData.main.feels_like}
                      <span className="ml-2 text-base">°C</span>
                    </p>
                  </div>
                  {/* <p className="flex text-5xl">
                    {weatherData.weather[0].description}
                  </p> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;

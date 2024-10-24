import React, { useEffect, useState } from 'react';

function MetrosWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const fetchWeatherData = async () => {
    try {
      const response = await fetch('http://localhost:5000/weather');
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="App max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Weather Monitoring System</h1>
      <div className="grid grid-cols-3 gap-4">
        {weatherData.map((cityWeather, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h2 className="text-xl ">{cityWeather.name}</h2>
            <p>Temperature: {(cityWeather.main.temp - 273.15).toFixed(2)} °C</p>
            <p>Feels Like: {(cityWeather.main.feels_like - 273.15).toFixed(2)} °C</p>
            <p>Condition: {cityWeather.weather[0].main}</p>
            <p>Unix Timestamp: {cityWeather.dt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetrosWeather;

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
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
        Weather Monitoring System
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {weatherData.map((cityWeather, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50 transition-transform transform hover:scale-105 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{cityWeather.name}</h2>
            <p className="text-gray-600">
              <span className="font-medium">Temperature:</span> {(cityWeather.main.temp - 273.15).toFixed(2)} °C
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Feels Like:</span> {(cityWeather.main.feels_like - 273.15).toFixed(2)} °C
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Condition:</span> {cityWeather.weather[0].main}
            </p>
            <p className="text-gray-500 text-sm italic">
              <span className="font-medium">Unix Timestamp:</span> {cityWeather.dt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetrosWeather;

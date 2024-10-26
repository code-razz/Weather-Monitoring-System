import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = () => {
  const [dailySummary, setDailySummary] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  // Fetch data
  const fetchDailySummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/daily-summary');
      const data = await response.json();
      setDailySummary(data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  // Filter data based on selected city
  useEffect(() => {
    if (selectedCity) {
      setFilteredSummary(dailySummary.filter((summary) => summary.city === selectedCity));
    }
  }, [selectedCity, dailySummary]);

  // Handle city selection
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Prepare chart data
  const data = {
    labels: filteredSummary.map((summary) => summary.date),
    datasets: [
      {
        label: `Avg Temperature in ${selectedCity} (°C)`,
        data: filteredSummary.map((summary) => (summary.avgTemperature - 273.15).toFixed(2)), // Convert to Celsius
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  useEffect(() => {
    fetchDailySummary();
  }, []);

  // Extract unique city names for dropdown
  const cityOptions = [...new Set(dailySummary.map((summary) => summary.city))];

  return (
    <div className="max-w-3xl mx-auto p-6 m-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Weather Trends</h2>
      <div className="flex flex-col items-center mb-6">
        <label htmlFor="city" className="text-gray-700 font-medium mb-2">Select City</label>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">--Select a City--</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg shadow">
        {selectedCity ? (
          <Line data={data} options={options} />
        ) : (
          <p className="text-center text-gray-600">Please select a city to view the chart</p>
        )}
      </div>
    </div>
  );
};

export default WeatherChart;

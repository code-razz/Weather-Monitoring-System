import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = () => {
  const [dailySummary, setDailySummary] = useState([]);

  const fetchDailySummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/daily-summary');
      const data = await response.json();
      setDailySummary(data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  const data = {
    labels: dailySummary.map((summary) => summary.date),
    datasets: [
      {
        label: 'Avg Temperature (°C)',
        data: dailySummary.map((summary) => (summary.avgTemperature - 273.15).toFixed(2)), // Convert to Celsius
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category', // Specify the x-axis as a category scale
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

  return (
    <div>
      <h2>Weather Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherChart;

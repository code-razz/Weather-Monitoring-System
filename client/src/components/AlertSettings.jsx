import React, { useState } from 'react';
import axios from 'axios';

function AlertSettings() {
  const [temperatureThreshold, setTemperatureThreshold] = useState('');
  const [conditionThreshold, setConditionThreshold] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alertData = {
      temperatureThreshold,
      conditionThreshold,
    };
    console.log(alertData)

    try {
      await axios.post('http://localhost:5000/alerts', alertData);
      alert('Alert settings saved!');
    } catch (error) {
      console.error('Error saving alert settings:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Set Alert Thresholds</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Temperature Threshold (°C):
          </label>
          <input
            type="number"
            value={temperatureThreshold}
            onChange={(e) => setTemperatureThreshold(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Condition Threshold (e.g., Rain):
          </label>
          <input
            type="text"
            value={conditionThreshold}
            onChange={(e) => setConditionThreshold(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default AlertSettings;

import React, { useState } from 'react';
import axios from 'axios';

const AlertForm = () => {
  const [temperatureThreshold, setTemperatureThreshold] = useState('');
  const [conditionThreshold, setConditionThreshold] = useState('');
  const [city, setCity] = useState(''); // New state for the city

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const alertData = {
      city: city.trim(),
      temperatureThreshold: temperatureThreshold.trim(),
      conditionThreshold: conditionThreshold.trim(),
    };

    console.log('Submitting data:', alertData);  // For debugging

    try {
      await axios.post('http://localhost:5000/alerts', alertData);
      alert('Alert settings saved!');
    } catch (error) {
      console.error('Error saving alert settings:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h1 className='text-2xl font-bold'>Create Weather Alert</h1>
    <form onSubmit={handleSubmit} className="space-y-4 m-2">
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter city"
        />
      </div>

      <div>
        <label htmlFor="temperatureThreshold" className="block text-sm font-medium text-gray-700">Temperature Threshold (°C)</label>
        <input
          type="number"
          id="temperatureThreshold"
          value={temperatureThreshold}
          onChange={(e) => setTemperatureThreshold(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="conditionThreshold" className="block text-sm font-medium text-gray-700">Weather Condition</label>
        <input
          type="text"
          id="conditionThreshold"
          value={conditionThreshold}
          onChange={(e) => setConditionThreshold(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500">Save Alert</button>
    </form>
    </div>
  );
};

export default AlertForm;

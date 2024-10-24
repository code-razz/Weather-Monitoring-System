import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import mongoose from 'mongoose';
import calculateDailySummary from './functions/calculateDailySummary.js';
import checkAlerts from './functions/checkAlerts.js';
import { Weather } from './schemas/weatherSchema.js';
import { AlertSettings } from './schemas/alertSchema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json()); // Important: To parse incoming JSON requests


const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

app.get('/weather', async (req, res) => {
  try {
    const weatherData = await Promise.all(cities.map(async (city) => {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`);
      const data = response.data;

      // Save data to MongoDB
      const weather = new Weather({
        city: data.name,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        condition: data.weather[0].main,
        timestamp: data.dt,
      });

      await weather.save();
      // Check alerts after fetching weather data
      await checkAlerts();

      return data;
    }));
    res.json(weatherData);
  } catch (error) {
    res.status(500).send('Error retrieving weather data');
  }
});

app.post('/alerts', async (req, res) => {
  const alertCondition = req.body;

  try {
    // Find an existing alert for the city and update it, or create a new one if it doesn't exist
    const alert = await AlertSettings.findOneAndUpdate(
      { city: alertCondition.city },  // Query to find the alert by city
      {                               // Fields to update or set
        threshold: alertCondition.temperatureThreshold,
        condition: alertCondition.conditionThreshold,
      },
      { new: true, upsert: true }      // Options: upsert creates a new document if none exists, new returns the updated document
    );

    res.status(200).send('Alert settings saved or updated successfully');
  } catch (error) {
    res.status(500).send('Error saving alert settings');
  }
});






// calculateDailySummary();
// Schedule daily aggregation at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Calculating daily weather summary');
  calculateDailySummary();
});

// Schedule to fetch weather data every hour
cron.schedule('0 * * * *', async () => {
  console.log('Fetching weather data');
  try {
    await axios.get('http://localhost:5000/weather');
    console.log('Weather data fetched successfully');
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

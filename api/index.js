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
import { DailySummary } from './schemas/dailySummarySchema.js';

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
    // Fetch and save weather data for each city
    const weatherData = await Promise.all(cities.map(async (city) => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`);
        const data = response.data;
        
        const date = new Date(data.dt * 1000);
        const weather = new Weather({
          city: data.name,
          temperature: data.main.temp,
          feels_like: data.main.feels_like,
          condition: data.weather[0].main,
          timestamp: data.dt,
          Local_TS: date.toLocaleString(),
        });

        await weather.save(); // Ensure save is complete
        return data;
      } catch (err) {
        console.error(`Error saving weather data for ${city}:`, err);
        return null; // Return null for failed saves
      }
    }));

    // Filter out any null entries from failed saves
    const successfulWeatherData = weatherData.filter(data => data !== null);

    // Call checkAlerts only after all saves are done
    console.log("All weather data saved, starting alert checks...");
    await checkAlerts();
    console.log("Alert checks complete");

    res.json(successfulWeatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).send('Error retrieving weather data');
  }
});


app.post('/alerts', async (req, res) => {
  const alertCondition = req.body;
  
  try {
    // console.log("kdfjkf")
    // console.log(typeof alertCondition.temperatureThreshold)
    // Find an existing alert for the city and update it, or create a new one if it doesn't exist
    const alert = await AlertSettings.findOneAndUpdate(
      { city: alertCondition.city },  // Query to find the alert by city
      {                               // Fields to update or set
        threshold: (Number(alertCondition.temperatureThreshold)+273.15),
        emailId: alertCondition.emailId,
      },
      { new: true, upsert: true }      // Options: upsert creates a new document if none exists, new returns the updated document
    );

    res.status(200).send('Alert settings saved or updated successfully');
  } catch (error) {
    res.status(500).send('Error saving alert settings');
  }
});

app.get('/daily-summary', async (req, res) => {
  try {
    const summaries = await DailySummary.find();
    res.json(summaries);
  } catch (error) {
    res.status(500).send('Error retrieving daily summary data');
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

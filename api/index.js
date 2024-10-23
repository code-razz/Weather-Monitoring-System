import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

app.get('/weather', async (req, res) => {
  try {
    const weatherData = await Promise.all(cities.map(async (city) => {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5//weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`);
    //   https://api.openweathermap.org/data/2.5//weather?q=London&appid=20d75b49d11680b16dde34dd08f22965
      return response.data;
    }));
    res.json(weatherData);
    // const response = await axios.get(`https://api.openweathermap.org/data/2.5//weather?q=${cities[0]}&appid=${process.env.OPENWEATHER_API_KEY}`);
    // res.json(response.data)
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

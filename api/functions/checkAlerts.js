import { AlertSettings } from "../schemas/alertSchema.js";
import { Weather } from "../schemas/weatherSchema.js";

async function checkAlerts() {
    const latestWeather = await Weather.find().sort({ timestamp: -1 }).limit(2); // Check the latest 2 updates
  
    latestWeather.forEach(async (weather) => {
      const alertSettings = await AlertSettings.findOne({ city: weather.city });
      if (alertSettings && weather.temperature > alertSettings.threshold) {
        console.log(`ALERT: ${weather.city} temperature exceeds ${alertSettings.threshold} degrees`);
  
        // Optionally, send email alerts here using the `sendAlertEmail` function
        // sendAlertEmail(weather.city, `Temperature exceeds ${alertSettings.threshold} degrees`);
      }
    });
  }

export default checkAlerts
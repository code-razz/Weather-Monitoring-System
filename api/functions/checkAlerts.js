import { AlertSettings } from "../schemas/alertSchema.js";
import { Weather } from "../schemas/weatherSchema.js";
import sendAlertEmail from "./sendAlertEmail.js";

async function checkAlerts() {
  const uniqueCities = new Set();
  const uniqueWeatherData = [];
  let skip = 0; // To keep track of how many records have been fetched

  while (uniqueWeatherData.length < 6) {
    // Fetch the next batch of 12 weather records, sorted by timestamp
    const latestWeatherBatch = await Weather.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(12);
    
    // If no more records are found, break the loop
    if (latestWeatherBatch.length === 0) {
      console.log("No more weather data available.");
      break;
    }

    // Iterate through the fetched batch to collect unique cities
    for (const weather of latestWeatherBatch) {
      if (!uniqueCities.has(weather.city)) {
        uniqueCities.add(weather.city);
        uniqueWeatherData.push(weather);
        
        // Stop if we have collected 6 unique entries
        if (uniqueWeatherData.length === 6) break;
      }
    }

    // Increment the skip counter for the next batch
    skip += 12;
  }

  // Retrieve alert settings for the unique cities in the uniqueWeatherData
  const cities = uniqueWeatherData.map(weather => weather.city);
  console.log(cities);
  const alertSettingsList = await AlertSettings.find({ city: { $in: cities } });

  // Map settings by city for easy access
  const alertSettingsMap = Object.fromEntries(alertSettingsList.map(setting => [setting.city, setting]));

  // Process alerts in parallel using Promise.all
  await Promise.all(uniqueWeatherData.map(async (weather) => {
    const alertSettings = alertSettingsMap[weather.city];
    
    if (alertSettings && weather.temperature > alertSettings.threshold) {
      const thresholdCelsius = alertSettings.threshold - 273.15;
      console.log(`ALERT: ${weather.city} temperature exceeds ${thresholdCelsius.toFixed(2)} oC`);
      await sendAlertEmail(alertSettings.emailId, weather.city, weather.temperature, weather.condition);
    }
  }));
}

export default checkAlerts;


// import { AlertSettings } from "../schemas/alertSchema.js";
// import { Weather } from "../schemas/weatherSchema.js";
// import sendAlertEmail from "./sendAlertEmail.js";

// async function checkAlerts() {
//     const latestWeather = await Weather.find().sort({ timestamp: -1 }).limit(6); // Check the latest 2 updates
//     latestWeather.forEach(async (weather) => {
//       console.log("k")
//       const alertSettings = await AlertSettings.findOne({ city: weather.city });
//       console.log(alertSettings)
//       if (alertSettings){

//         console.log(alertSettings.threshold)
//         console.log(weather.temperature)
//       }
//       if (alertSettings && (weather.temperature) > alertSettings.threshold) {
//         console.log(`ALERT: ${weather.city} temperature exceeds ${(alertSettings.threshold-273.15)} degrees`);
//         // console.log(alertSettings.emailId)
//         // sendAlertEmail(alertSettings.emailId, weather.city, weather.temperature, weather.condition);
//         // Optionally, send email alerts here using the `sendAlertEmail` function
//         // sendAlertEmail(weather.city, `Temperature exceeds ${alertSettings.threshold} degrees`);
//       }
//     });
//   }

// export default checkAlerts


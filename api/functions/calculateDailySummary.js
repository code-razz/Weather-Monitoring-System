import { DailySummary } from "../schemas/dailySummarySchema.js";
import { Weather } from "../schemas/weatherSchema.js";

async function calculateDailySummary() {
    const dailyWeather = await Weather.aggregate([
      {
        $group: {
          _id: {
            city: "$city",
            day: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: { $multiply: ["$timestamp", 1000] } } } }
          },
          avgTemperature: { $avg: "$temperature" },
          maxTemperature: { $max: "$temperature" },
          minTemperature: { $min: "$temperature" },
          conditions: { $push: "$condition" }, // Gather all conditions into an array
        },
      },
      {
        $project: {
          city: "$_id.city",
          date: "$_id.day",
          avgTemperature: 1,
          maxTemperature: 1,
          minTemperature: 1,
          conditions: 1, // Keep conditions array in the result for further processing
        }
      }
    ]);

    // Calculate the dominant condition and prepare entries for upsert
    const updates = dailyWeather.map(entry => {
      const conditionCounts = {};
      let dominantCondition = '';

      // Count the frequency of each weather condition
      entry.conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });

      // Find the condition with the highest frequency
      dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      // Prepare the upsert operation
      return {
        updateOne: {
          filter: { city: entry.city, date: entry.date },
          update: {
            city: entry.city,
            date: entry.date,
            avgTemperature: entry.avgTemperature,
            maxTemperature: entry.maxTemperature,
            minTemperature: entry.minTemperature,
            dominantCondition: dominantCondition
          },
          upsert: true
        }
      };
    });

    // Perform bulk upsert to save or replace existing entries
    await DailySummary.bulkWrite(updates);
}

export default calculateDailySummary;

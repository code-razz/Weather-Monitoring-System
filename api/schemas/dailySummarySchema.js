import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema({
    city: String,
    date: String, // Format: 'YYYY-MM-DD'
    avgTemperature: Number,
    maxTemperature: Number,
    minTemperature: Number,
    dominantCondition: String,
  });

const DailySummary = mongoose.model('DailySummary', dailySummarySchema);
export {DailySummary}
export default dailySummarySchema
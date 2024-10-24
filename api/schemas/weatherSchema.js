import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    feels_like: Number,
    condition: String,
    timestamp: Number,
  });

export default weatherSchema
  
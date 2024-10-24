import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    feels_like: Number,
    condition: String,
    timestamp: Number,
  });

  
const Weather = mongoose.model('Weather', weatherSchema);
export {Weather}

export default weatherSchema
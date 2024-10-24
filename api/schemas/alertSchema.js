import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    city: String,
    threshold: Number, // e.g., temperature threshold
    condition: String, // e.g., "temperature"
  });
  
const AlertSettings = mongoose.model('AlertSettings', alertSchema);
export {AlertSettings}

export default alertSchema
  
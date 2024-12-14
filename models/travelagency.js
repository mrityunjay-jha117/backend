import mongoose from 'mongoose';

const agencySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  contact: {
    email: { type: String, required: true },
    phone: { type: String },
  },
  services: [String],  // Array of services the agency offers (e.g., guided tours, travel packages)
  ratings: { type: Number, min: 1, max: 5 },
  reviews: [
    {
      username: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  establishedDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
});

const TravelAgency = mongoose.model('TravelAgency', agencySchema);

export default TravelAgency;

import mongoose from 'mongoose';

const guideSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  bio: { type: String },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  availableDates: [Date],
  expertise: [String],
  languages: [String],
  rating: { type: Number, min: 1, max: 5 },
  pricePerHour: { type: Number, required: true },
  picture: { type: String, required: true },
  contact: { type: Number, required: true },
  reviews: [
    {
      username: { type: String },
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Guide = mongoose.model('Guide', guideSchema);

export default Guide;

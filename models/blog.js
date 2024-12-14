import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  travelDate: { type: Date, required: true },
  blogDate: { type: Date, default: Date.now },
  images: [String],
  rating: { type: Number, min: 1, max: 5 },
  cost: { type: Number },
  tags: [String],
  comments: [
    {
      username: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

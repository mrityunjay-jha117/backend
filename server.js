import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import guideRoutes from './routes/guides.js';
import blogRoutes from './routes/blogs.js';
import travelRoutes from './routes/travelRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

const { MONGO_URI, PORT } = process.env;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/guides', guideRoutes);
app.use('/blogs', blogRoutes);
app.use('/travelAgencies',travelRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

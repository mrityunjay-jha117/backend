import express from 'express';
import TravelAgency from '../models/travelAgency.js';

const router = express.Router();

// Search for travel agencies
router.get('/search', async (req, res) => {
  try {
    const { services, city, minRating } = req.query;
    const query = {};

    if (services && typeof services === 'string') {
      const serviceArray = services.split(',');
      query.services = { $in: serviceArray };
    }

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minRating) query.ratings = { $gte: Number(minRating) };

    const agencies = await TravelAgency.find(query);

    if (agencies.length === 0) {
      return res.status(404).json({ message: 'No travel agencies found for the specified filters.' });
    }

    res.status(200).json(agencies);
  } catch (error) {
    console.error('Error during travel agency search:', error);
    res.status(500).json({ message: 'Internal server error during search.' });
  }
});

// Add a new travel agency
router.post('/add_agency', async (req, res) => {
  try {
    const agencyData = req.body;
    const newAgency = new TravelAgency(agencyData);
    const savedAgency = await newAgency.save();
    res.status(201).json(savedAgency);
  } catch (error) {
    console.error('Error adding travel agency:', error);
    res.status(500).json({ message: 'Internal server error: Unable to add travel agency.' });
  }
});

// Update travel agency details
router.put('/update/:id', async (req, res) => {
  try {
    const agencyId = req.params.id;
    const updateData = req.body;

    const updateFields = {};

    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key])) {
          for (const subKey in updateData[key]) {
            if (updateData[key].hasOwnProperty(subKey)) {
              updateFields[`${key}.${subKey}`] = updateData[key][subKey];
            }
          }
        } else {
          updateFields[key] = updateData[key];
        }
      }
    }

    const updatedAgency = await TravelAgency.findByIdAndUpdate(
      agencyId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedAgency) {
      return res.status(404).json({ message: 'Travel agency not found' });
    }

    res.status(200).json(updatedAgency);
  } catch (error) {
    console.error('Error updating travel agency:', error);
    res.status(500).json({ message: 'Internal server error during agency update' });
  }
});

export default router;

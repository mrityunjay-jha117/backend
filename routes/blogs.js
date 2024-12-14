import express from 'express';
import Blog from '../models/blog.js';

const router = express.Router();

// Consolidated search route
router.get('/search', async (req, res) => {
  try {
    const { tags, authorName, minCost, maxCost, city, title } = req.query;
    const query = {};

    if (tags && typeof tags === 'string') {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    if (authorName) query['author.name'] = new RegExp(authorName, 'i');
    if (minCost) query.cost = { $gte: Number(minCost) };
    if (maxCost) query.cost = { ...query.cost, $lte: Number(maxCost) };
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (title) query.title = new RegExp(title, 'i');  // Title search included here

    const blogs = await Blog.find(query);

    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found for the specified filters.' });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error during blog search:', error);
    res.status(500).json({ message: 'Internal server error during search.' });
  }
});

// Search by ID
router.get('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update blog details
router.put('/update/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
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

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Internal server error during blog update' });
  }
});

// Add a new blog
router.post('/add_blog', async (req, res) => {
  try {
    const blogData = req.body;
    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ message: 'Internal server error: Unable to add blog.' });
  }
});

export default router;

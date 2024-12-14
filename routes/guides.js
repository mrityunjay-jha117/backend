import express from "express";
import Guide from "../models/guide.js";

const router = express.Router();

// Search for guides
router.get("/search_guides", async (req, res) => {
  try {
    const { expertise, language, minRating, maxPrice, city } = req.query;
    const query = {};

    if (expertise && typeof expertise === "string") {
      const expertiseArray = expertise.split(",");
      query.expertise = { $in: expertiseArray };
    }

    if (language && typeof language === "string") {
      const languageArray = language.split(",");
      query.languages = { $in: languageArray };
    }

    if (minRating) query.rating = { $gte: Number(minRating) };
    if (maxPrice) query.pricePerHour = { $lte: Number(maxPrice) };
    if (city) query["location.city"] = new RegExp(city, "i");

    const guides = await Guide.find(query);

    if (guides.length === 0) {
      return res
        .status(404)
        .json({ message: "No guides found for the specified filters." });
    }

    res.status(200).json(guides);
  } catch (error) {
    console.error("Error during guide search:", error);
    res.status(500).json({ message: "Internal server error during search." });
  }
});

// Update guide details
router.put("/update_guide/:id", async (req, res) => {
  try {
    const guideId = req.params.id;
    const updateData = req.body;

    const updateFields = {};

    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        if (
          typeof updateData[key] === "object" &&
          !Array.isArray(updateData[key])
        ) {
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

    const updatedGuide = await Guide.findByIdAndUpdate(
      guideId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.status(200).json(updatedGuide);
  } catch (error) {
    console.error("Error updating guide:", error);
    res
      .status(500)
      .json({ message: "Internal server error during guide update" });
  }
});

// Add a new guide
router.post("/add_guide", async (req, res) => {
  try {
    const guideData = req.body;
    const newGuide = new Guide(guideData);
    const savedGuide = await newGuide.save();
    res.status(201).json(savedGuide);
  } catch (error) {
    console.error("Error adding guide:", error);
    res
      .status(500)
      .json({ message: "Internal server error: Unable to add guide." });
  }
});

export default router;

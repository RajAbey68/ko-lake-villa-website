
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Basic gallery endpoint
router.get("/api/gallery", async (req, res) => {
  try {
    const images = await storage.getGalleryImages();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

// Simple upload endpoint
router.post("/api/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, category, alt, description, tags, featured, mediaType } = req.body;
    
    // Move file to permanent location
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const categoryDir = path.join('uploads', 'gallery', category);
    
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const finalPath = path.join(categoryDir, fileName);
    fs.renameSync(req.file.path, finalPath);
    
    // Save to database
    const imageData = {
      imageUrl: `/uploads/gallery/${category}/${fileName}`,
      alt: alt || title,
      title: title,
      description: description || title,
      category: category,
      tags: tags || category,
      featured: featured === 'true',
      sortOrder: 0,
      mediaType: mediaType || 'image'
    };
    
    const result = await storage.createGalleryImage(imageData);
    res.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Delete image endpoint
router.delete("/api/gallery/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteGalleryImage(id);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export { router as simpleRouter };

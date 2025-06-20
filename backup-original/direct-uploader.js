import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple express app for direct uploads
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create upload directories if they don't exist
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const GALLERY_DIR = path.join(UPLOAD_DIR, 'gallery');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get category from request body, default to 'default' if not provided
    const category = req.body.category || 'default';
    
    // Sanitize the category name to prevent directory traversal
    const safeCategory = category.replace(/[^a-zA-Z0-9 -]/g, '_');
    
    // Create path to category directory
    const destination = path.join(GALLERY_DIR, safeCategory);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeFilename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

// Create a simple HTML uploader interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ko Lake Villa - Direct Image Uploader</title>
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #FDF6EE;
          color: #8B5E3C;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          font-family: 'Playfair Display', serif;
          color: #8B5E3C;
          text-align: center;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        select, input, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #A0B985;
          border-radius: 4px;
          font-family: 'Montserrat', sans-serif;
        }
        button {
          background-color: #FF914D;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          display: block;
          margin: 20px auto;
        }
        button:hover {
          background-color: #e67e3e;
        }
        .progress {
          height: 20px;
          background-color: #f5f5f5;
          border-radius: 4px;
          margin-top: 20px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background-color: #A0B985;
          width: 0%;
          transition: width 0.3s;
        }
        .message {
          text-align: center;
          margin: 20px 0;
          padding: 10px;
          border-radius: 4px;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <h1>Ko Lake Villa - Direct Image Uploader</h1>
      <div id="messageContainer"></div>
      
      <form id="uploadForm">
        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" name="category" required>
            <option value="">Select a category</option>
            <option value="Family Suite">Family Suite</option>
            <option value="Group Room">Group Room</option>
            <option value="Triple Room">Triple Room</option>
            <option value="Dining Area">Dining Area</option>
            <option value="Pool Deck">Pool Deck</option>
            <option value="Lake Garden">Lake Garden</option>
            <option value="Roof Garden">Roof Garden</option>
            <option value="Front Garden and Entrance">Front Garden and Entrance</option>
            <option value="Koggala Lake Ahangama and Surrounding">Koggala Lake Ahangama and Surrounding</option>
            <option value="Excursions">Excursions</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="files">Select Images (You can select multiple):</label>
          <input type="file" id="files" name="files" multiple accept="image/*" required>
        </div>
        
        <div class="form-group">
          <label for="description">Description (Optional):</label>
          <textarea id="description" name="description" rows="3"></textarea>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" id="featured" name="featured">
            Featured Image
          </label>
        </div>
        
        <button type="submit">Upload Images</button>
      </form>
      
      <div class="progress" style="display: none;">
        <div class="progress-bar"></div>
      </div>
      
      <div id="results"></div>
      
      <script>
        document.getElementById('uploadForm').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const files = document.getElementById('files').files;
          const category = document.getElementById('category').value;
          const description = document.getElementById('description').value;
          const featured = document.getElementById('featured').checked;
          
          if (files.length === 0) {
            showMessage('Please select at least one file', 'error');
            return;
          }
          
          if (!category) {
            showMessage('Please select a category', 'error');
            return;
          }
          
          // Show progress bar
          const progressBar = document.querySelector('.progress');
          const progressBarInner = document.querySelector('.progress-bar');
          progressBar.style.display = 'block';
          progressBarInner.style.width = '0%';
          
          // Clear previous results
          document.getElementById('results').innerHTML = '';
          
          // Function to upload a single file
          const uploadFile = (file, index) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('category', category);
              formData.append('description', description);
              formData.append('featured', featured.toString());
              
              const xhr = new XMLHttpRequest();
              
              xhr.open('POST', '/upload', true);
              
              xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                  const percentComplete = (e.loaded / e.total) * 100;
                  const overallProgress = ((index / files.length) * 100) + (percentComplete / files.length);
                  progressBarInner.style.width = overallProgress + '%';
                }
              };
              
              xhr.onload = function() {
                if (this.status === 200) {
                  resolve(JSON.parse(this.response));
                } else {
                  reject(new Error('Upload failed'));
                }
              };
              
              xhr.onerror = function() {
                reject(new Error('Upload failed'));
              };
              
              xhr.send(formData);
            });
          };
          
          // Upload files sequentially
          const uploadSequentially = async () => {
            const results = [];
            
            showMessage('Upload started...', 'info');
            
            for (let i = 0; i < files.length; i++) {
              try {
                const result = await uploadFile(files[i], i);
                results.push({ file: files[i].name, success: true, data: result });
                
                // Update results display
                document.getElementById('results').innerHTML += 
                  '<p>✅ ' + files[i].name + ' uploaded successfully</p>';
              } catch (error) {
                console.error('Error uploading file:', error);
                results.push({ file: files[i].name, success: false, error });
                
                // Update results display
                document.getElementById('results').innerHTML += 
                  '<p>❌ Failed to upload ' + files[i].name + '</p>';
              }
              
              // Update overall progress
              const overallProgress = ((i + 1) / files.length) * 100;
              progressBarInner.style.width = overallProgress + '%';
            }
            
            // All uploads completed
            showMessage('Upload completed! ' + results.filter(r => r.success).length + 
                        ' of ' + files.length + ' files uploaded successfully.', 
                        results.every(r => r.success) ? 'success' : 'error');
            
            return results;
          };
          
          uploadSequentially().catch(error => {
            console.error('Upload process failed:', error);
            showMessage('Upload process failed: ' + error.message, 'error');
          });
        });
        
        function showMessage(message, type) {
          const container = document.getElementById('messageContainer');
          const messageElement = document.createElement('div');
          messageElement.className = 'message ' + (type || 'info');
          messageElement.textContent = message;
          
          // Clear previous messages
          container.innerHTML = '';
          container.appendChild(messageElement);
          
          // Scroll to message
          messageElement.scrollIntoView({ behavior: 'smooth' });
        }
      </script>
    </body>
    </html>
  `);
});

// Handle file upload
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ 
        success: false,
        message: "File upload error", 
        error: err.message 
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: "No file uploaded" 
        });
      }
      
      // Create file data for database
      const fileData = {
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename,
        category: req.body.category || 'default',
        description: req.body.description || '',
        featured: req.body.featured === 'true'
      };
      
      // Create URL for the uploaded file - use actual category folder
      const fileUrl = `/uploads/gallery/${fileData.category}/${req.file.filename}`;
      
      // Create entry in our JSON database
      const galleryEntry = {
        id: Date.now(),
        imageUrl: fileUrl,
        alt: req.file.originalname,
        description: fileData.description,
        category: fileData.category,
        featured: fileData.featured,
        mediaType: 'image',
        sortOrder: 0
      };
      
      // Save entry to a log file
      const logDir = path.join(process.cwd(), 'uploads', 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const logFile = path.join(logDir, 'uploads.json');
      let uploads = [];
      
      if (fs.existsSync(logFile)) {
        try {
          uploads = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        } catch (error) {
          console.error('Error reading upload log:', error);
        }
      }
      
      uploads.push(galleryEntry);
      fs.writeFileSync(logFile, JSON.stringify(uploads, null, 2), 'utf8');
      
      res.json({ 
        success: true,
        message: "File uploaded successfully", 
        data: galleryEntry
      });
    } catch (error) {
      console.error("Error processing upload:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to process upload",
        error: error.message
      });
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Direct uploader running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to upload images`);
});
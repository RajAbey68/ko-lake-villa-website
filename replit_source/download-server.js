
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002;

// Serve the zip file for download
app.get('/download/test-matrix', (req, res) => {
  const filePath = path.join(__dirname, 'ko-lake-villa-complete-test-matrix.zip');
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'ko-lake-villa-complete-test-matrix.zip', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).send('Download failed');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});

// Simple HTML page with download link  
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ko Lake Villa Test Matrix Download</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
            .download-btn { 
                background: #007bff; 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 5px; 
                font-size: 18px;
                display: inline-block;
                margin: 20px;
            }
            .download-btn:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h1>Ko Lake Villa Test Matrix Download</h1>
        <p>Click the button below to download the complete test matrix ZIP file:</p>
        <a href="/download/test-matrix" class="download-btn">📥 Download Test Matrix ZIP</a>
        <p><small>File size: ~17KB</small></p>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Download server running at http://0.0.0.0:${PORT}`);
  console.log(`Direct download link: http://0.0.0.0:${PORT}/download/test-matrix`);
});

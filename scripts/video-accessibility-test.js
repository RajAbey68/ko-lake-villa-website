/**
 * VIDEO ACCESSIBILITY AND COMPATIBILITY TEST
 * Tests if videos are properly served and accessible
 */

const fs = require('fs');
const path = require('path');

class VideoAccessibilityTest {
    constructor() {
        this.baseDir = process.cwd();
        this.publicDir = path.join(this.baseDir, 'public');
        this.uploadsDir = path.join(this.publicDir, 'uploads', 'gallery', 'default');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    async testVideoFiles() {
        this.log('🎥 Testing Video File Accessibility');
        this.log('==================================');

        if (!fs.existsSync(this.uploadsDir)) {
            this.log('Uploads directory not found!', 'error');
            return false;
        }

        const videoFiles = fs.readdirSync(this.uploadsDir)
            .filter(file => file.endsWith('.mp4'))
            .slice(0, 3); // Test first 3 videos

        if (videoFiles.length === 0) {
            this.log('No video files found!', 'error');
            return false;
        }

        let allPassed = true;

        for (const videoFile of videoFiles) {
            const filePath = path.join(this.uploadsDir, videoFile);
            const stats = fs.statSync(filePath);
            const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            this.log(`\n📹 Testing: ${videoFile}`);
            this.log(`   Size: ${sizeInMB} MB`);
            this.log(`   Web URL: /uploads/gallery/default/${videoFile}`);
            
            // Check if file is readable
            try {
                const buffer = fs.readFileSync(filePath, { encoding: null });
                const isValidMP4 = buffer.slice(4, 8).toString() === 'ftyp';
                
                if (isValidMP4) {
                    this.log(`   ✅ Valid MP4 format`, 'success');
                } else {
                    this.log(`   ❌ Invalid MP4 format`, 'error');
                    allPassed = false;
                }
                
                // Check file permissions
                try {
                    fs.accessSync(filePath, fs.constants.R_OK);
                    this.log(`   ✅ File readable`, 'success');
                } catch (error) {
                    this.log(`   ❌ File not readable: ${error.message}`, 'error');
                    allPassed = false;
                }
                
            } catch (error) {
                this.log(`   ❌ Error reading file: ${error.message}`, 'error');
                allPassed = false;
            }
        }

        return allPassed;
    }

    async testGalleryImplementation() {
        this.log('\n🖼️  Testing Gallery Implementation');
        this.log('================================');

        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        
        if (!fs.existsSync(galleryPagePath)) {
            this.log('Gallery page not found!', 'error');
            return false;
        }

        const content = fs.readFileSync(galleryPagePath, 'utf8');
        
        // Check video URLs in static data
        const videoUrlRegex = /\/uploads\/gallery\/default\/.*\.mp4/g;
        const videoUrls = content.match(videoUrlRegex) || [];
        
        this.log(`Found ${videoUrls.length} video URLs in gallery:`);
        videoUrls.forEach((url, index) => {
            this.log(`   ${index + 1}. ${url}`);
            
            // Check if corresponding file exists
            const fileName = path.basename(url);
            const filePath = path.join(this.uploadsDir, fileName);
            
            if (fs.existsSync(filePath)) {
                this.log(`      ✅ File exists`, 'success');
            } else {
                this.log(`      ❌ File missing`, 'error');
            }
        });

        // Check video player implementation
        const hasVideoElement = content.includes('<video');
        const hasControls = content.includes('controls');
        const hasAutoPlay = content.includes('autoPlay');
        const hasErrorHandling = content.includes('onError');

        this.log('\nVideo Player Features:');
        this.log(`   Video Element: ${hasVideoElement ? '✅' : '❌'}`);
        this.log(`   Controls: ${hasControls ? '✅' : '❌'}`);
        this.log(`   AutoPlay: ${hasAutoPlay ? '✅' : '❌'}`);
        this.log(`   Error Handling: ${hasErrorHandling ? '✅' : '❌'}`);

        return hasVideoElement && hasControls && hasErrorHandling;
    }

    async testNextJsPublicServing() {
        this.log('\n🌐 Testing Next.js Public File Serving');
        this.log('=====================================');

        // Check if Next.js is configured to serve static files
        const nextConfigPath = path.join(this.baseDir, 'next.config.js');
        const nextConfigTsPath = path.join(this.baseDir, 'next.config.ts');
        
        let nextConfigExists = false;
        let staticFileConfig = 'Default';
        
        if (fs.existsSync(nextConfigPath)) {
            nextConfigExists = true;
            const config = fs.readFileSync(nextConfigPath, 'utf8');
            if (config.includes('images') || config.includes('static')) {
                staticFileConfig = 'Custom configuration found';
            }
        } else if (fs.existsSync(nextConfigTsPath)) {
            nextConfigExists = true;
            const config = fs.readFileSync(nextConfigTsPath, 'utf8');
            if (config.includes('images') || config.includes('static')) {
                staticFileConfig = 'Custom configuration found';
            }
        }

        this.log(`Next.js Config: ${nextConfigExists ? '✅ Found' : '⚠️  Using defaults'}`);
        this.log(`Static Files: ${staticFileConfig}`);

        // Check public directory structure
        const publicStructure = {
            uploads: fs.existsSync(path.join(this.publicDir, 'uploads')),
            gallery: fs.existsSync(path.join(this.publicDir, 'uploads', 'gallery')),
            default: fs.existsSync(path.join(this.publicDir, 'uploads', 'gallery', 'default'))
        };

        this.log('Public Directory Structure:');
        this.log(`   /public/uploads: ${publicStructure.uploads ? '✅' : '❌'}`);
        this.log(`   /public/uploads/gallery: ${publicStructure.gallery ? '✅' : '❌'}`);
        this.log(`   /public/uploads/gallery/default: ${publicStructure.default ? '✅' : '❌'}`);

        return publicStructure.uploads && publicStructure.gallery && publicStructure.default;
    }

    async generateVideoTestHTML() {
        this.log('\n📝 Generating Video Test HTML');
        this.log('============================');

        const videoFiles = fs.readdirSync(this.uploadsDir)
            .filter(file => file.endsWith('.mp4'))
            .slice(0, 3);

        const testHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Test - Ko Lake Villa</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .video-test { margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
        video { width: 100%; max-width: 600px; height: auto; }
        .status { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>Ko Lake Villa - Video Accessibility Test</h1>
    <p>This page tests if videos are properly served by Next.js</p>
    
    ${videoFiles.map((file, index) => `
    <div class="video-test">
        <h3>Video ${index + 1}: ${file}</h3>
        <video controls preload="metadata" 
               onloadstart="updateStatus('${file}', 'Loading...', 'info')"
               oncanplay="updateStatus('${file}', 'Ready to play', 'success')"
               onerror="updateStatus('${file}', 'Failed to load', 'error')">
            <source src="/uploads/gallery/default/${file}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div id="status-${file}" class="status">Initializing...</div>
        <p><strong>URL:</strong> /uploads/gallery/default/${file}</p>
    </div>
    `).join('')}
    
    <script>
        function updateStatus(filename, message, type) {
            const statusEl = document.getElementById('status-' + filename);
            statusEl.textContent = message;
            statusEl.className = 'status ' + (type === 'error' ? 'error' : type === 'success' ? 'success' : '');
        }
        
        // Test direct URL access
        ${videoFiles.map(file => `
        fetch('/uploads/gallery/default/${file}', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    console.log('✅ ${file} is accessible via HTTP');
                } else {
                    console.error('❌ ${file} HTTP error:', response.status);
                    updateStatus('${file}', 'HTTP Error: ' + response.status, 'error');
                }
            })
            .catch(error => {
                console.error('❌ ${file} fetch error:', error);
                updateStatus('${file}', 'Network error: ' + error.message, 'error');
            });
        `).join('')}
    </script>
</body>
</html>`;

        const testFilePath = path.join(this.publicDir, 'video-test.html');
        fs.writeFileSync(testFilePath, testHTML);
        
        this.log(`✅ Test HTML created: /video-test.html`);
        this.log(`   Open http://localhost:3000/video-test.html to test videos`);
        
        return testFilePath;
    }

    async runAllTests() {
        this.log('🚀 Starting Video Accessibility Test Suite');
        this.log('==========================================');

        const results = {
            videoFiles: await this.testVideoFiles(),
            galleryImplementation: await this.testGalleryImplementation(),
            nextjsServing: await this.testNextJsPublicServing()
        };

        await this.generateVideoTestHTML();

        this.log('\n📊 TEST RESULTS SUMMARY');
        this.log('======================');
        this.log(`Video Files: ${results.videoFiles ? '✅ PASS' : '❌ FAIL'}`);
        this.log(`Gallery Implementation: ${results.galleryImplementation ? '✅ PASS' : '❌ FAIL'}`);
        this.log(`Next.js Serving: ${results.nextjsServing ? '✅ PASS' : '❌ FAIL'}`);

        const allPassed = Object.values(results).every(Boolean);
        
        if (allPassed) {
            this.log('\n🎉 All tests passed! Videos should work correctly.', 'success');
            this.log('   If videos still don\'t work, check browser console for errors.');
        } else {
            this.log('\n⚠️  Some tests failed. Check the issues above.', 'error');
        }

        return results;
    }
}

// Run tests if called directly
if (require.main === module) {
    const testSuite = new VideoAccessibilityTest();
    testSuite.runAllTests().then(results => {
        process.exit(Object.values(results).every(Boolean) ? 0 : 1);
    });
}

module.exports = VideoAccessibilityTest; 
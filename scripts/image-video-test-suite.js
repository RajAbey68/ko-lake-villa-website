/**
 * IMAGE AND VIDEO OPERATIONS TEST SUITE
 * Ko Lake Villa Website - Media Functionality Testing
 * 
 * Tests based on IMAGE_VIDEO_TEST_MATRIX.md
 */

const fs = require('fs');
const path = require('path');

class MediaTestSuite {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            tests: []
        };
        this.baseDir = process.cwd();
        this.publicDir = path.join(this.baseDir, 'public');
        this.uploadsDir = path.join(this.publicDir, 'uploads', 'gallery');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    async runTest(testId, testName, testFunction) {
        try {
            this.log(`Running ${testId}: ${testName}`);
            const result = await testFunction();
            if (result.passed) {
                this.results.passed++;
                this.log(`${testId} PASSED: ${result.message}`, 'success');
            } else {
                this.results.failed++;
                this.log(`${testId} FAILED: ${result.message}`, 'error');
            }
            this.results.tests.push({ testId, testName, ...result });
        } catch (error) {
            this.results.failed++;
            this.log(`${testId} ERROR: ${error.message}`, 'error');
            this.results.tests.push({ 
                testId, 
                testName, 
                passed: false, 
                message: error.message 
            });
        }
    }

    // IMAGE OPERATION TESTS

    async testIMG_001_StaticImagesLoad() {
        const heroImage = path.join(this.publicDir, 'images', 'hero-pool.jpg');
        const excursionsImage = path.join(this.publicDir, 'images', 'excursions-hero.jpg');
        
        const heroExists = fs.existsSync(heroImage);
        const excursionsExists = fs.existsSync(excursionsImage);
        
        return {
            passed: heroExists && excursionsExists,
            message: heroExists && excursionsExists 
                ? 'Static images found and accessible'
                : `Missing images: ${!heroExists ? 'hero-pool.jpg ' : ''}${!excursionsExists ? 'excursions-hero.jpg' : ''}`
        };
    }

    async testIMG_002_GalleryStructure() {
        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        
        if (!fs.existsSync(galleryPagePath)) {
            return { passed: false, message: 'Gallery page not found' };
        }

        const content = fs.readFileSync(galleryPagePath, 'utf8');
        const hasStaticData = content.includes('staticGalleryData');
        const hasMediaItems = content.includes('MediaItem');
        const hasCategories = content.includes('categories');

        return {
            passed: hasStaticData && hasMediaItems && hasCategories,
            message: hasStaticData && hasMediaItems && hasCategories
                ? 'Gallery structure properly implemented'
                : 'Gallery structure incomplete'
        };
    }

    // VIDEO OPERATION TESTS

    async testVID_001_VideoFilesExist() {
        if (!fs.existsSync(this.uploadsDir)) {
            return { passed: false, message: 'Uploads directory not found' };
        }

        const videoFiles = [];
        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    scanDir(fullPath);
                } else if (item.endsWith('.mp4')) {
                    videoFiles.push(fullPath);
                }
            });
        };

        scanDir(this.uploadsDir);

        return {
            passed: videoFiles.length > 0,
            message: videoFiles.length > 0 
                ? `Found ${videoFiles.length} video files: ${videoFiles.map(f => path.basename(f)).join(', ')}`
                : 'No video files found in uploads directory'
        };
    }

    async testVID_002_VideoPlayerImplementation() {
        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        const publicGalleryPath = path.join(this.baseDir, 'components', 'public-gallery.tsx');
        
        if (!fs.existsSync(galleryPagePath) || !fs.existsSync(publicGalleryPath)) {
            return { passed: false, message: 'Gallery component files not found' };
        }

        const galleryContent = fs.readFileSync(galleryPagePath, 'utf8');
        const publicContent = fs.readFileSync(publicGalleryPath, 'utf8');
        
        const hasVideoElement = galleryContent.includes('<video') && publicContent.includes('<video');
        const hasVideoControls = galleryContent.includes('controls') && publicContent.includes('controls');
        const hasVideoSrc = galleryContent.includes('src={') && publicContent.includes('src={');
        const hasPlayButton = galleryContent.includes('Play') || publicContent.includes('Play');

        return {
            passed: hasVideoElement && hasVideoControls && hasVideoSrc,
            message: hasVideoElement && hasVideoControls && hasVideoSrc
                ? 'Video player properly implemented with controls'
                : `Missing video implementation: ${!hasVideoElement ? 'video element ' : ''}${!hasVideoControls ? 'controls ' : ''}${!hasVideoSrc ? 'src attribute' : ''}`
        };
    }

    async testVID_003_VideoMetadata() {
        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        
        if (!fs.existsSync(galleryPagePath)) {
            return { passed: false, message: 'Gallery page not found' };
        }

        const content = fs.readFileSync(galleryPagePath, 'utf8');
        const hasVideoTitles = content.includes('Complete Villa Walkthrough Tour') || 
                              content.includes('Lake View Experience') ||
                              content.includes('Sunset Over Lake');
        const hasVideoDescriptions = content.includes('Comprehensive tour') ||
                                   content.includes('Beautiful views') ||
                                   content.includes('Stunning sunset');

        return {
            passed: hasVideoTitles && hasVideoDescriptions,
            message: hasVideoTitles && hasVideoDescriptions
                ? 'Video metadata properly configured'
                : 'Video metadata missing or incomplete'
        };
    }

    // GALLERY INTERFACE TESTS

    async testGAL_001_ResponsiveGrid() {
        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        
        if (!fs.existsSync(galleryPagePath)) {
            return { passed: false, message: 'Gallery page not found' };
        }

        const content = fs.readFileSync(galleryPagePath, 'utf8');
        const hasResponsiveGrid = content.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3') ||
                                 content.includes('responsive') ||
                                 content.includes('grid');
        const hasHoverEffects = content.includes('hover:');
        const hasAspectRatio = content.includes('aspect-video') || content.includes('aspect-');

        return {
            passed: hasResponsiveGrid && hasHoverEffects && hasAspectRatio,
            message: hasResponsiveGrid && hasHoverEffects && hasAspectRatio
                ? 'Responsive gallery grid properly implemented'
                : 'Gallery grid missing responsive features'
        };
    }

    async testGAL_002_CategoryFilters() {
        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        
        if (!fs.existsSync(galleryPagePath)) {
            return { passed: false, message: 'Gallery page not found' };
        }

        const content = fs.readFileSync(galleryPagePath, 'utf8');
        const hasFilterButtons = content.includes('setSelectedCategory') && 
                                content.includes('selectedCategory');
        const hasAllFilter = content.includes('"all"') && content.includes('All Photos');
        const hasCategoryMap = content.includes('categories.map');

        return {
            passed: hasFilterButtons && hasAllFilter && hasCategoryMap,
            message: hasFilterButtons && hasAllFilter && hasCategoryMap
                ? 'Category filters properly implemented'
                : 'Category filter functionality incomplete'
        };
    }

    // ERROR HANDLING TESTS

    async testERR_001_VideoErrorHandling() {
        const galleryPagePath = path.join(this.baseDir, 'app', 'gallery', 'page.tsx');
        const publicGalleryPath = path.join(this.baseDir, 'components', 'public-gallery.tsx');
        
        if (!fs.existsSync(galleryPagePath) || !fs.existsSync(publicGalleryPath)) {
            return { passed: false, message: 'Gallery component files not found' };
        }

        const galleryContent = fs.readFileSync(galleryPagePath, 'utf8');
        const publicContent = fs.readFileSync(publicGalleryPath, 'utf8');
        
        const hasOnError = galleryContent.includes('onError') || publicContent.includes('onError');
        const hasErrorMessage = galleryContent.includes('Video failed to load') || 
                               publicContent.includes('Video Unavailable');
        const hasFallback = galleryContent.includes('poster=') || publicContent.includes('poster=');

        return {
            passed: hasOnError && hasErrorMessage && hasFallback,
            message: hasOnError && hasErrorMessage && hasFallback
                ? 'Video error handling properly implemented'
                : 'Video error handling incomplete'
        };
    }

    // PERFORMANCE TESTS

    async testPRF_001_FileOptimization() {
        const uploadsDefaultDir = path.join(this.uploadsDir, 'default');
        
        if (!fs.existsSync(uploadsDefaultDir)) {
            return { passed: false, message: 'Default uploads directory not found' };
        }

        const files = fs.readdirSync(uploadsDefaultDir);
        const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
        const videoFiles = files.filter(f => f.match(/\.(mp4|mov|webm)$/i));
        
        let totalImageSize = 0;
        let totalVideoSize = 0;
        
        imageFiles.forEach(file => {
            const stats = fs.statSync(path.join(uploadsDefaultDir, file));
            totalImageSize += stats.size;
        });
        
        videoFiles.forEach(file => {
            const stats = fs.statSync(path.join(uploadsDefaultDir, file));
            totalVideoSize += stats.size;
        });
        
        const avgImageSize = imageFiles.length > 0 ? totalImageSize / imageFiles.length : 0;
        const avgVideoSize = videoFiles.length > 0 ? totalVideoSize / videoFiles.length : 0;
        
        const imageOptimal = avgImageSize < 2 * 1024 * 1024; // <2MB average
        const videoReasonable = avgVideoSize < 50 * 1024 * 1024; // <50MB average

        return {
            passed: imageOptimal && videoReasonable,
            message: `Images: ${imageFiles.length} files, avg ${(avgImageSize/1024/1024).toFixed(1)}MB. Videos: ${videoFiles.length} files, avg ${(avgVideoSize/1024/1024).toFixed(1)}MB`
        };
    }

    async runAllTests() {
        this.log('🚀 Starting Image and Video Operations Test Suite');
        this.log('===============================================');

        // Image Operation Tests
        this.log('\n📸 IMAGE OPERATION TESTS');
        await this.runTest('IMG_001', 'Static Images Load', () => this.testIMG_001_StaticImagesLoad());
        await this.runTest('IMG_002', 'Gallery Structure', () => this.testIMG_002_GalleryStructure());

        // Video Operation Tests  
        this.log('\n🎥 VIDEO OPERATION TESTS');
        await this.runTest('VID_001', 'Video Files Exist', () => this.testVID_001_VideoFilesExist());
        await this.runTest('VID_002', 'Video Player Implementation', () => this.testVID_002_VideoPlayerImplementation());
        await this.runTest('VID_003', 'Video Metadata', () => this.testVID_003_VideoMetadata());

        // Gallery Interface Tests
        this.log('\n🖼️  GALLERY INTERFACE TESTS');
        await this.runTest('GAL_001', 'Responsive Grid', () => this.testGAL_001_ResponsiveGrid());
        await this.runTest('GAL_002', 'Category Filters', () => this.testGAL_002_CategoryFilters());

        // Error Handling Tests
        this.log('\n⚠️  ERROR HANDLING TESTS');
        await this.runTest('ERR_001', 'Video Error Handling', () => this.testERR_001_VideoErrorHandling());

        // Performance Tests
        this.log('\n⚡ PERFORMANCE TESTS');
        await this.runTest('PRF_001', 'File Optimization', () => this.testPRF_001_FileOptimization());

        this.printSummary();
        return this.results;
    }

    printSummary() {
        const total = this.results.passed + this.results.failed + this.results.skipped;
        const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;

        this.log('\n' + '='.repeat(50));
        this.log('📊 TEST EXECUTION SUMMARY');
        this.log('='.repeat(50));
        this.log(`Total Tests: ${total}`);
        this.log(`✅ Passed: ${this.results.passed}`);
        this.log(`❌ Failed: ${this.results.failed}`);
        this.log(`⏭️  Skipped: ${this.results.skipped}`);
        this.log(`📈 Pass Rate: ${passRate}%`);
        
        if (this.results.failed > 0) {
            this.log('\n🔍 FAILED TESTS:');
            this.results.tests
                .filter(test => !test.passed)
                .forEach(test => {
                    this.log(`   ${test.testId}: ${test.message}`, 'error');
                });
        }

        if (passRate >= 90) {
            this.log('\n🎉 EXCELLENT! Gallery media functionality is working well.', 'success');
        } else if (passRate >= 75) {
            this.log('\n👍 GOOD! Most functionality works, some improvements needed.', 'info');
        } else {
            this.log('\n⚠️  NEEDS ATTENTION! Several critical issues found.', 'error');
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const testSuite = new MediaTestSuite();
    testSuite.runAllTests().then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}

module.exports = MediaTestSuite; 

// Ko Lake Villa - Gallery Unit Tests
const { expect, test, describe } = require('@jest/globals');

describe('Gallery Management', () => {
  describe('Image Upload', () => {
    test('should validate image file types', () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const invalidTypes = ['text/plain', 'application/pdf'];
      
      validTypes.forEach(type => {
        expect(isValidImageType(type)).toBe(true);
      });
      
      invalidTypes.forEach(type => {
        expect(isValidImageType(type)).toBe(false);
      });
    });

    test('should enforce file size limits', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      expect(isValidFileSize(maxSize - 1)).toBe(true);
      expect(isValidFileSize(maxSize + 1)).toBe(false);
    });

    test('should generate unique filenames', () => {
      const filename1 = generateUniqueFilename('test.jpg');
      const filename2 = generateUniqueFilename('test.jpg');
      expect(filename1).not.toBe(filename2);
    });
  });

  describe('Image Categorization', () => {
    test('should categorize bedroom images', () => {
      const mockImageData = { features: ['bed', 'pillows', 'bedroom'] };
      expect(categorizeImage(mockImageData)).toBe('bedrooms');
    });

    test('should categorize common area images', () => {
      const mockImageData = { features: ['sofa', 'living room', 'seating'] };
      expect(categorizeImage(mockImageData)).toBe('common-areas');
    });

    test('should handle uncategorizable images', () => {
      const mockImageData = { features: ['unknown', 'unclear'] };
      expect(categorizeImage(mockImageData)).toBe('uncategorized');
    });
  });

  describe('Gallery Display', () => {
    test('should filter images by category', () => {
      const images = [
        { category: 'bedrooms', id: 1 },
        { category: 'bathrooms', id: 2 },
        { category: 'bedrooms', id: 3 }
      ];
      
      const filtered = filterImagesByCategory(images, 'bedrooms');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(img => img.category === 'bedrooms')).toBe(true);
    });

    test('should sort images by upload date', () => {
      const images = [
        { uploadDate: '2024-01-03', id: 1 },
        { uploadDate: '2024-01-01', id: 2 },
        { uploadDate: '2024-01-02', id: 3 }
      ];
      
      const sorted = sortImagesByDate(images);
      expect(sorted[0].uploadDate).toBe('2024-01-01');
      expect(sorted[2].uploadDate).toBe('2024-01-03');
    });
  });
});

// Helper functions for testing
function isValidImageType(mimeType) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(mimeType);
}

function isValidFileSize(size) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return size <= maxSize;
}

function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

function categorizeImage(imageData) {
  const bedroomFeatures = ['bed', 'pillows', 'bedroom', 'mattress'];
  const commonAreaFeatures = ['sofa', 'living room', 'seating', 'couch'];
  
  const hasBedroomFeatures = imageData.features.some(feature => 
    bedroomFeatures.includes(feature.toLowerCase())
  );
  
  const hasCommonAreaFeatures = imageData.features.some(feature => 
    commonAreaFeatures.includes(feature.toLowerCase())
  );
  
  if (hasBedroomFeatures) return 'bedrooms';
  if (hasCommonAreaFeatures) return 'common-areas';
  return 'uncategorized';
}

function filterImagesByCategory(images, category) {
  return images.filter(img => img.category === category);
}

function sortImagesByDate(images) {
  return [...images].sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
}

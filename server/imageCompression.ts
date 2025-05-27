import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

interface CompressionOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'jpeg' | 'webp' | 'png';
  progressive?: boolean;
}

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export class SmartImageCompressor {
  private readonly outputDir: string;
  private readonly maxWidth = 1920; // Max width for high-res displays
  private readonly maxHeight = 1080; // Max height for gallery images
  
  constructor(outputDir: string = 'uploads/compressed') {
    this.outputDir = outputDir;
    this.ensureOutputDirectory();
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      if (!existsSync(this.outputDir)) {
        await fs.mkdir(this.outputDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating output directory:', error);
    }
  }

  /**
   * Smart compression that chooses optimal settings based on image content
   */
  async compressImage(inputPath: string, options: CompressionOptions = {}): Promise<CompressionResult> {
    try {
      // Get original file stats
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      // Analyze image to determine optimal compression strategy
      const metadata = await sharp(inputPath).metadata();
      const { width = 0, height = 0, format: originalFormat } = metadata;

      // Determine optimal settings based on image characteristics
      const optimalSettings = this.determineOptimalSettings(width, height, originalSize, originalFormat);
      const finalOptions = { ...optimalSettings, ...options };

      // Generate output filename
      const inputFilename = path.parse(inputPath).name;
      const outputFormat = finalOptions.format || 'webp';
      const outputPath = path.join(this.outputDir, `${inputFilename}-compressed.${outputFormat}`);

      // Create Sharp processing pipeline
      let pipeline = sharp(inputPath);

      // Resize if needed (maintain aspect ratio)
      if (width > this.maxWidth || height > this.maxHeight) {
        pipeline = pipeline.resize(this.maxWidth, this.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      } else if (finalOptions.width || finalOptions.height) {
        pipeline = pipeline.resize(finalOptions.width, finalOptions.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Apply format-specific compression
      switch (outputFormat) {
        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality: finalOptions.quality || 85,
            progressive: finalOptions.progressive !== false,
            mozjpeg: true // Use mozjpeg encoder for better compression
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality: finalOptions.quality || 80,
            effort: 6 // Higher effort for better compression
          });
          break;
        case 'png':
          pipeline = pipeline.png({
            quality: finalOptions.quality || 90,
            compressionLevel: 9,
            adaptiveFiltering: true
          });
          break;
      }

      // Process and save
      const outputInfo = await pipeline.toFile(outputPath);
      const compressedStats = await fs.stat(outputPath);
      const compressedSize = compressedStats.size;

      return {
        originalSize,
        compressedSize,
        compressionRatio: Math.round((1 - compressedSize / originalSize) * 100),
        outputPath,
        format: outputFormat,
        dimensions: {
          width: outputInfo.width,
          height: outputInfo.height
        }
      };

    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error(`Image compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Batch compress multiple images
   */
  async compressBatch(inputPaths: string[], options: CompressionOptions = {}): Promise<CompressionResult[]> {
    const results: CompressionResult[] = [];
    
    for (const inputPath of inputPaths) {
      try {
        const result = await this.compressImage(inputPath, options);
        results.push(result);
        console.log(`✅ Compressed: ${path.basename(inputPath)} (${result.compressionRatio}% reduction)`);
      } catch (error) {
        console.error(`❌ Failed to compress: ${path.basename(inputPath)}`, error);
      }
    }

    return results;
  }

  /**
   * Create multiple optimized versions (thumbnail, medium, large)
   */
  async createResponsiveVersions(inputPath: string): Promise<{ thumbnail: CompressionResult; medium: CompressionResult; large: CompressionResult }> {
    const thumbnail = await this.compressImage(inputPath, {
      width: 300,
      height: 200,
      quality: 75,
      format: 'webp'
    });

    const medium = await this.compressImage(inputPath, {
      width: 800,
      height: 600,
      quality: 80,
      format: 'webp'
    });

    const large = await this.compressImage(inputPath, {
      width: 1920,
      height: 1080,
      quality: 85,
      format: 'webp'
    });

    return { thumbnail, medium, large };
  }

  /**
   * Determine optimal compression settings based on image characteristics
   */
  private determineOptimalSettings(width: number, height: number, fileSize: number, format?: string): CompressionOptions {
    const megapixels = (width * height) / 1000000;
    const fileSizeMB = fileSize / (1024 * 1024);

    // Default to WebP for best compression and quality balance
    let outputFormat: 'jpeg' | 'webp' | 'png' = 'webp';
    let quality = 80;

    // Adjust quality based on image size and content
    if (megapixels > 8) {
      // Very high resolution images
      quality = 75;
    } else if (megapixels > 4) {
      // High resolution images
      quality = 80;
    } else if (megapixels > 2) {
      // Medium resolution images
      quality = 85;
    } else {
      // Small images - use higher quality
      quality = 90;
    }

    // Adjust for file size
    if (fileSizeMB > 5) {
      quality -= 10; // More aggressive compression for large files
    } else if (fileSizeMB < 0.5) {
      quality += 5; // Less compression for small files
    }

    // Keep PNG for images that might have transparency
    if (format === 'png' && fileSizeMB < 2) {
      outputFormat = 'png';
      quality = 90;
    }

    return {
      format: outputFormat,
      quality: Math.max(60, Math.min(95, quality)), // Clamp between 60-95
      progressive: true
    };
  }

  /**
   * Get compression statistics for reporting
   */
  async getCompressionStats(results: CompressionResult[]): Promise<{
    totalOriginalSize: number;
    totalCompressedSize: number;
    averageCompressionRatio: number;
    totalSpaceSaved: number;
  }> {
    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
    const averageCompressionRatio = results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length;
    const totalSpaceSaved = totalOriginalSize - totalCompressedSize;

    return {
      totalOriginalSize,
      totalCompressedSize,
      averageCompressionRatio: Math.round(averageCompressionRatio),
      totalSpaceSaved
    };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const imageCompressor = new SmartImageCompressor();
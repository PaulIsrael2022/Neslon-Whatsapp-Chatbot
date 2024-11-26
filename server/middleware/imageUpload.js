import multer from 'multer';
import sharp from 'sharp';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Image processing middleware
export const processImage = async (buffer) => {
  try {
    const processedImage = await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export default upload;
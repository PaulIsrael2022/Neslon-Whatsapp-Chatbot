import sharp from 'sharp';

export const processImage = async (buffer, options = {}) => {
  try {
    const {
      width = 800,
      height = 800,
      quality = 80,
      format = 'jpeg'
    } = options;

    const processedImage = await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      [format]({
        quality
      })
      .toBuffer();

    return {
      data: processedImage,
      contentType: `image/${format}`
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export const imageToBase64 = (buffer, contentType) => {
  if (!buffer) return null;
  return `data:${contentType};base64,${buffer.toString('base64')}`;
};

export const validateImage = async (buffer) => {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      isValid: true,
      metadata
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};
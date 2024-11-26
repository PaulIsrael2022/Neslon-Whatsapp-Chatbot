import React, { useState, useEffect } from 'react';

interface DebugImageProps {
  src: { url: string; headers: { Authorization: string } } | string;
  alt: string;
  className?: string;
}

const DebugImage: React.FC<DebugImageProps> = ({ src, alt, className = '' }) => {
  const [error, setError] = useState<Error | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (typeof src === 'string') {
          setImageSrc(src);
          return;
        }

        const response = await fetch(src.url, {
          headers: src.headers,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (err) {
        console.error(`Error loading image ${alt}:`, err);
        setError(err as Error);
      }
    };

    loadImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src, alt]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading image ${alt}:`, e);
    console.log('Image source that failed:', typeof src === 'string' ? src : src.url);
    setError(new Error('Failed to load image'));
    setLoaded(false);
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image: ${alt}`);
    setLoaded(true);
    setError(null);
  };

  return (
    <div className="relative">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${error ? 'border-2 border-red-500' : ''}`}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500 text-sm p-2 text-center">
          Failed to load image
          <br />
          Check console for details
        </div>
      )}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </div>
  );
};

export default DebugImage;
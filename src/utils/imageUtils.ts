// Utility functions for handling image loading with fallbacks

// Default placeholder images (using data URLs for reliability)
const PLACEHOLDER_IMAGES = {
  project: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjAwVjE2MEgyMjVWMTgwSDE3NVYxNjBIMjAwVjE0MEgxNzVWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5Qcm9qZWN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4K',
  profile: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNTAgMTcwQzUwIDEzNS44MTcgNzMuODE3IDExMiAxMDggMTEySDkyQzEyNi4xODMgMTEyIDE1MCAxMzUuODE3IDE1MCAxNzBIMTAwSDUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
};

// Cache for validated image URLs
const imageCache = new Map<string, boolean>();

/**
 * Validates if an image URL is accessible
 * @param imageUrl - The image URL to validate
 * @returns Promise<boolean> - True if image is accessible, false otherwise
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  if (!imageUrl) return false;
  
  // Check cache first
  if (imageCache.has(imageUrl)) {
    return imageCache.get(imageUrl)!;
  }
  
  try {
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      mode: 'no-cors' // Allow cross-origin requests
    });
    
    const isValid = response.ok || response.type === 'opaque';
    imageCache.set(imageUrl, isValid);
    return isValid;
  } catch (error) {
    console.warn(`Image validation failed for ${imageUrl}:`, error);
    imageCache.set(imageUrl, false);
    return false;
  }
};

/**
 * Gets a safe image URL with fallback
 * @param imageUrl - The original image URL
 * @param fallbackType - Type of fallback image ('project' | 'profile')
 * @returns Promise<string> - Safe image URL or fallback
 */
export const getSafeImageUrl = async (
  imageUrl: string | undefined,
  fallbackType: keyof typeof PLACEHOLDER_IMAGES = 'project'
): Promise<string> => {
  if (!imageUrl) {
    return PLACEHOLDER_IMAGES[fallbackType];
  }
  
  const isValid = await validateImageUrl(imageUrl);
  return isValid ? imageUrl : PLACEHOLDER_IMAGES[fallbackType];
};

/**
 * Creates an image element with error handling
 * @param src - Image source URL
 * @param fallbackType - Type of fallback image
 * @returns Promise<string> - Final image URL to use
 */
export const createSafeImage = (src: string, fallbackType: keyof typeof PLACEHOLDER_IMAGES = 'project'): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(src);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      resolve(PLACEHOLDER_IMAGES[fallbackType]);
    };
    
    img.src = src;
    
    // Timeout after 5 seconds
    setTimeout(() => {
      if (!img.complete) {
        console.warn(`Image loading timeout: ${src}`);
        resolve(PLACEHOLDER_IMAGES[fallbackType]);
      }
    }, 5000);
  });
};

/**
 * Preloads multiple images with fallbacks
 * @param imageUrls - Array of image URLs to preload
 * @param fallbackType - Type of fallback image
 * @returns Promise<string[]> - Array of safe image URLs
 */
export const preloadImages = async (
  imageUrls: (string | undefined)[],
  fallbackType: keyof typeof PLACEHOLDER_IMAGES = 'project'
): Promise<string[]> => {
  const promises = imageUrls.map(url => 
    url ? createSafeImage(url, fallbackType) : Promise.resolve(PLACEHOLDER_IMAGES[fallbackType])
  );
  
  return Promise.all(promises);
};
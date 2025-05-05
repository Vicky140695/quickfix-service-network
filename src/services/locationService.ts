
// Location tracking service
import { toast } from 'sonner';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
}

// Get current location
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now()
        };
        
        // Optionally reverse geocode to get address
        getAddressFromCoordinates(locationData.latitude, locationData.longitude)
          .then(address => {
            resolve({
              ...locationData,
              address
            });
          })
          .catch(() => {
            // Still resolve even if reverse geocoding fails
            resolve(locationData);
          });
      },
      (error) => {
        toast.error(`Error getting location: ${error.message}`);
        reject(error);
      }
    );
  });
};

// Get address from coordinates using a free geocoding service
export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || "Unknown location";
  } catch (error) {
    console.error("Error getting address:", error);
    return "Unknown location";
  }
};

// Save location data to local storage (until we have backend integration)
export const saveLocationData = (locationData: LocationData) => {
  try {
    const existingData = localStorage.getItem('locationHistory');
    const locationHistory = existingData ? JSON.parse(existingData) : [];
    locationHistory.push(locationData);
    localStorage.setItem('locationHistory', JSON.stringify(locationHistory));
  } catch (error) {
    console.error("Error saving location data:", error);
  }
};

// Get location history from local storage
export const getLocationHistory = (): LocationData[] => {
  try {
    const existingData = localStorage.getItem('locationHistory');
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error("Error getting location history:", error);
    return [];
  }
};

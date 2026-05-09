export interface GeoLocation {
  city: string;
  area: string;
  error?: string;
}

export const getCurrentLocation = (): Promise<GeoLocation> => {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ city: '', area: '', error: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // OpenStreetMap Nominatim for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.state_district || '';
            const area = data.address.suburb || data.address.neighbourhood || data.address.village || '';
            resolve({ city, area });
          } else {
            resolve({ city: '', area: '', error: 'Location not found' });
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          resolve({ city: '', area: '', error: 'Failed to fetch location data' });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve({ city: '', area: '', error: error.message });
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  });
};

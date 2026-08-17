/**
 * SLICK TEK Geolocation & Reverse-Geocoding Module
 * Converts high-accuracy GPS coordinates into real street addresses
 * with instant fallback support.
 */

const GeoService = {
  // Check if browser supports geolocation
  isSupported() {
    return 'geolocation' in navigator;
  },

  /**
   * Request device location and reverse-geocode into formatted address
   * @param {Function} onProgress - Progress status callback
   * @returns {Promise<Object>} { address, street, city, landmark, coords, raw }
   */
  async getAutoAddress(onProgress = () => {}) {
    if (!this.isSupported()) {
      throw new Error("Geolocation is not supported by your browser.");
    }

    onProgress("Requesting satellite GPS coordinates...");

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            onProgress("Resolving exact street address from GPS...");

            const geoData = await this.reverseGeocode(latitude, longitude);
            resolve({
              ...geoData,
              coords: { latitude, longitude, accuracy },
              isGps: true
            });
          } catch (err) {
            console.warn("Reverse geocode network error, providing coordinate fallback", err);
            // In case of rate limit or network offline, provide readable coordinates
            resolve({
              formattedAddress: `GPS Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
              street: "Detected Location",
              city: "Current Metro Area",
              landmark: "Near GPS Pin",
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              },
              isGps: true
            });
          }
        },
        (error) => {
          let msg = "Unable to retrieve your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "Location permission denied. Please enter your address manually or enable location permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information is currently unavailable. Please enter address manually.";
              break;
            case error.TIMEOUT:
              msg = "Location request timed out. Please try again or enter manually.";
              break;
          }
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  /**
   * Reverse-geocode coordinates via OpenStreetMap Nominatim
   */
  async reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
    
    // Add custom header/timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();
      const addr = data.address || {};

      // Build components
      const houseNumber = addr.house_number || '';
      const road = addr.road || addr.street || addr.pedestrian || addr.footway || '';
      const streetAddress = [houseNumber, road].filter(Boolean).join(' ') || addr.neighbourhood || addr.suburb || '';
      const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
      const city = addr.city || addr.town || addr.municipality || addr.county || 'Metro Area';
      const state = addr.state || '';
      const postcode = addr.postcode || '';

      // Construct clean readable address
      const parts = [];
      if (streetAddress) parts.push(streetAddress);
      if (suburb && suburb !== streetAddress) parts.push(suburb);
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (postcode) parts.push(postcode);

      const formattedAddress = parts.join(', ') || data.display_name || 'Current Location';

      return {
        formattedAddress,
        street: streetAddress || 'Your Street',
        suburb: suburb,
        city: city,
        state: state,
        postcode: postcode,
        raw: data
      };
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  },

  /**
   * Demo Fast-Fill presets for instant testing
   */
  getDemoLocation() {
    return {
      formattedAddress: "740 5th Avenue, Suite 18A, Midtown Manhattan, New York, NY 10019",
      street: "740 5th Avenue, Suite 18A",
      suburb: "Midtown Manhattan",
      city: "New York",
      state: "NY",
      postcode: "10019",
      coords: { latitude: 40.7624, longitude: -73.9744, accuracy: 5 },
      isGps: false
    };
  }
};

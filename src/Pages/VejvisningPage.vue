<template>
  <section class="vejvisning">
    <section class="map-container">
      <p class="address-label">Adresse:</p>
      <p class="address">{{ address }}</p>
      
      <div style="width: 100%; height: 400px; position: relative;">
        <!-- Loading overlay -->
        <div v-if="(isGeocoding || !isMapReady || isFadingOut) && address" 
             :class="['loading-overlay', { 'fade-out': isFadingOut }]">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Finder adresse...</p>
          </div>
        </div>
        
        <GMapMap
            ref="mapRef"
            :center="mapCenter"
            :zoom="zoom"
            map-type-id="roadmap"
            style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
            :options="{
              zoomControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false,
              keyboardShortcuts: false,
              mapDataProviders: null,
              clickableIcons: false,
              disableDefaultUI: true
            }"
        >
          <!-- Current location marker -->
          <GMapMarker
            v-if="currentLocation"
            :position="currentLocation"
            :icon="{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }"
            :title="'Din position'"
          />
          
          <!-- Destination marker -->
          <GMapMarker
            v-if="!isGeocoding && address && hasGeocodedAddress"
            :position="destination"
            :icon="{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }"
            :title="`Afhentningssted: ${address}`"
          />
          
          <!-- Directions polyline -->
          <GMapPolyline
            v-if="directionsPath.length > 0"
            :path="directionsPath"
            :options="{ strokeColor: '#FF0000', strokeWeight: 3 }"
          />
        </GMapMap>
      </div>
      <!--Chat Icon-->
      <v-fab
        class="centered-fab"
        icon="mdi-chat"
        style="bottom: 80px; right: -5px; left: auto"
      ></v-fab>
      <!-- Her vises billedet -->
      <img :src="kortImage" alt="Kortvejvisning" class="map-image" />
    </section>
  </section>
</template>

<script>
export default {
  name: "VejvisningView",
  data() {
    return {
      address: null,
      destination: { lat: 55.641931, lng: 12.081708 }, // Default Roskilde, Denmark coordinates
      currentLocation: null,
      mapCenter: { lat: 55.641931, lng: 12.081708 },
      zoom: 10,
      directionsPath: [],
      directionsService: null,
      geocoder: null,
      isGeocoding: false,
      hasGeocodedAddress: false,
      loadingStartTime: null,
      isMapReady: false,
      isFadingOut: false
    };
  },
  watch: {
    address: {
      handler(newAddress) {
        this.hasGeocodedAddress = false;
        this.isMapReady = false;
        this.isFadingOut = false;
        if (newAddress) {
          this.isGeocoding = true;
          this.loadingStartTime = Date.now();
          if (this.geocoder) {
            this.geocodeAddress();
          } else {
            // Retry after geocoder is initialized
            setTimeout(() => {
              if (this.geocoder) {
                this.geocodeAddress();
              } else {
                this.isGeocoding = false;
              }
            }, 1000);
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            // If address was geocoded, update map and get directions
            if (this.address && (this.destination.lat !== 55.641931 || this.destination.lng !== 12.081708)) {
              this.centerMapBetweenPoints();
              this.getDirections();
            } else {
              // Center map between current location and destination
              this.centerMapBetweenPoints();
              // Automatically get directions
              this.getDirections();
            }
          },
          (error) => {
            console.log('Error getting location:', error);
            // Fallback to default location
            this.currentLocation = { lat: 55.641931, lng: 12.081708 }; // Same as destination
            // If address was geocoded, update map and get directions
            if (this.address && (this.destination.lat !== 55.641931 || this.destination.lng !== 12.081708)) {
              this.centerMapBetweenPoints();
              this.getDirections();
            } else {
              this.centerMapBetweenPoints();
              // Automatically get directions with fallback location
              this.getDirections();
            }
          }
        );
      }
    },
    
    initializeDirectionsService() {
      this.$nextTick(() => {
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          // eslint-disable-next-line no-undef
          this.directionsService = new google.maps.DirectionsService();
        } else {
          // Retry after a short delay if Google Maps isn't loaded yet
          setTimeout(() => {
            this.initializeDirectionsService();
          }, 500);
        }
      });
    },
    
    initializeGeocoder() {
      this.$nextTick(() => {
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          // eslint-disable-next-line no-undef
          this.geocoder = new google.maps.Geocoder();
          if (this.address) {
            this.geocodeAddress();
          }
        } else {
          // Retry after a short delay if Google Maps isn't loaded yet
          setTimeout(() => {
            this.initializeGeocoder();
          }, 500);
        }
      });
    },
    
    async geocodeAddress() {
      if (!this.address || !this.geocoder) {
        return;
      }
      
      // Loading state is already set in watcher
      if (!this.loadingStartTime) {
        this.loadingStartTime = Date.now();
      }
      
      try {
        // Format address for better geocoding (add Denmark if not present)
        let formattedAddress = this.address;
        if (!this.address.toLowerCase().includes('denmark') && !this.address.toLowerCase().includes('danmark')) {
          formattedAddress = `${this.address}, Denmark`;
        }
        
        const result = await new Promise((resolve, reject) => {
          this.geocoder.geocode({ address: formattedAddress }, (results, status) => {
            // eslint-disable-next-line no-undef
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error(`Kunne ikke finde adressen: ${this.address}`));
            }
          });
        });
        
        const location = result.geometry.location;
        this.destination = {
          lat: location.lat(),
          lng: location.lng()
        };
        this.hasGeocodedAddress = true;
        
        // Update map center and get directions
        if (this.currentLocation) {
          this.centerMapBetweenPoints();
          this.getDirections();
        } else {
          // Center on destination if no current location yet
          this.mapCenter = this.destination;
          this.zoom = 15;
        }
        
        // Wait for map to position properly, then fade out
        setTimeout(() => {
          this.isMapReady = true;
          this.isFadingOut = true;
          
          // Remove overlay after fade animation completes
          setTimeout(() => {
            this.isFadingOut = false;
          }, 500);
        }, 1500);
        
      } catch (error) {
        console.error('Geocoding error:', error);
        // Don't show marker if geocoding fails
        this.hasGeocodedAddress = false;
        this.isMapReady = true;
      } finally {
        // Ensure minimum loading duration of 1200ms to prevent flash
        const minLoadingDuration = 1200;
        const elapsedTime = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, minLoadingDuration - elapsedTime);
        
        setTimeout(() => {
          this.isGeocoding = false;
          this.isMapReady = true;
          this.isFadingOut = true;
          
          // Remove overlay after fade animation completes
          setTimeout(() => {
            this.isFadingOut = false;
          }, 500);
        }, remainingTime);
      }
    },
    
    getDirections() {
      if (!this.currentLocation || !this.directionsService) return;
      
      // eslint-disable-next-line no-undef
      if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps API not loaded yet');
        return;
      }
      
      this.directionsService.route(
        {
          origin: this.currentLocation,
          destination: this.destination,
          // eslint-disable-next-line no-undef
          travelMode: 'DRIVING',
        },
        (result, status) => {
          // eslint-disable-next-line no-undef
          if (status === 'OK' && result && result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            if (route.overview_path) {
              this.directionsPath = route.overview_path.map(point => ({
                lat: point.lat(),
                lng: point.lng()
              }));
              
              // Adjust zoom to show entire route
              this.fitMapToRoute();
            }
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    },
    
    centerMapBetweenPoints() {
      if (!this.currentLocation) return;
      
      // eslint-disable-next-line no-undef
      if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps API not loaded yet');
        return;
      }
      
      try {
        // eslint-disable-next-line no-undef
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.currentLocation);
        bounds.extend(this.destination);
        
        const center = bounds.getCenter();
        this.mapCenter = {
          lat: center.lat(),
          lng: center.lng()
        };
        this.zoom = 12;
      } catch (error) {
        console.error('Error centering map:', error);
      }
    },
    
    fitMapToRoute() {
      if (this.directionsPath.length === 0) return;
      
      // eslint-disable-next-line no-undef
      if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps API not loaded yet');
        return;
      }
      
      try {
        // eslint-disable-next-line no-undef
        const bounds = new google.maps.LatLngBounds();
        this.directionsPath.forEach(point => {
          bounds.extend(point);
        });
        
        if (this.$refs.mapRef && this.$refs.mapRef.$mapObject) {
          this.$refs.mapRef.$mapObject.fitBounds(bounds);
        }
      } catch (error) {
        console.error('Error fitting map to route:', error);
      }
    }
  },
  mounted() {
    // Get address from route params
    const address = this.$route.params.address;
    this.address = address;
    
    // Initialize map services
    this.getCurrentLocation();
    this.initializeDirectionsService();
    this.initializeGeocoder();
  },
};
  import kortImage from "@/assets/kort.png";

  export default {
    name: "VejvisningView",
    data() {
      return {
        kortImage,
        address: null,
      };
    },
    methods: {},
    mounted() {
      // Eventuel initialisering kan ske her
      const address = this.$route.params.address;
      this.address = address;
    },
  };
</script>

<style scoped>
  .vejvisning {
    background: white;
    color: #000000;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .header-title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 14px;
    color: black;
  }

  .topbar {
    background: #555;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .map-container {
    background: white;
    margin-top: 16px;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  }

.map-container {
  background: white;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}
  .address-label {
    font-size: 14px;
    color: #333;
    margin: 0;
  }

  .address {
    background: white;
    color: black;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  }

  .map-image {
    width: 100%;
    border-radius: 8px;
    margin-top: 5px;
  }

.map-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 5px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 8px;
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

.loading-overlay.fade-out {
  opacity: 0;
}

.loading-content {
  text-align: center;
  color: #333;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}
  .centered-fab {
    position: fixed !important;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999 !important;
  }
</style>

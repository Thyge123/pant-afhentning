<template>
        <div style="width: 100%; height: 485px; position: relative;">    
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
            <!-- Current location marker for Roskilde address -->
            <GMapMarker
                :position="mapCenter"
                :icon="{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }"
                :title="`Din position: ${targetAddress}`"
            />
            
            <!-- Pant location markers -->
            <GMapMarker
                v-for="location in pantLocations"
                :key="location.pantLocationId"
                :position="{ lat: location.latitude, lng: location.longitude }"
                :icon="{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }"
                :title="location.name"
                @click="showLocationDetails(location)"
            />
            
            <!-- Directions polyline -->
            <GMapPolyline
                v-if="directionsPath.length > 0"
                :path="directionsPath"
                :options="{ strokeColor: '#FF0000', strokeWeight: 3 }"
            />
        </GMapMap>
        
        <!-- Location Details Dialog - positioned over map only -->
        <div 
            v-if="showDetailsDialog" 
            class="dialog-overlay"
            @click="showDetailsDialog = false"
        >
            <div class="dialog-content" @click.stop>
                <v-card class="location-details-card">
                    <v-card-title class="text-h6 pa-4 bg-primary text-white">
                        {{ selectedLocation?.name }}
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <div class="mb-3">
                            <v-icon icon="mdi-map-marker-outline" class="mr-2 text-primary"></v-icon>
                            <strong>Adresse:</strong>
                            <div class="ml-8">{{ selectedLocation?.address }}</div>
                        </div>
                        
                        <div class="mb-3" v-if="selectedLocation?.openingHours">
                            <v-icon icon="mdi-clock-outline" class="mr-2 text-primary"></v-icon>
                            <strong>Åbningstider:</strong>
                            <div class="ml-8">{{ selectedLocation?.openingHours }}</div>
                        </div>
                        
                        <div class="mb-3" v-if="selectedLocation?.contactPhone">
                            <v-icon icon="mdi-phone" class="mr-2 text-primary"></v-icon>
                            <strong>Telefon:</strong>
                            <div class="ml-8">{{ selectedLocation?.contactPhone }}</div>
                        </div>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-btn 
                            color="primary" 
                            variant="elevated"
                            @click="showDirections"
                            class="mr-2"
                        >
                            <v-icon icon="mdi-directions" class="mr-1"></v-icon>
                            Vis vejledning
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="showDetailsDialog = false">
                            Luk
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
      </div>
</template>

<script>
import PantLocationDataService from "@/services/PantLocationDataService";

export default {
    name: 'PantLocations',
    data() {
        return {
            mapCenter: { lat: 55.641931, lng: 12.081708 }, // Maglegårdsvej 2 (Zealand), 4000 Roskilde
            zoom: 15,
            targetAddress: 'Maglegårdsvej 2, 4000 Roskilde',
            geocoder: null,
            pantLocations: [],
            showDetailsDialog: false,
            selectedLocation: null,
            directionsPath: [],
            directionsService: null,
            mapOptions: {
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                scaleControl: false,
                rotateControl: false,
                keyboardShortcuts: false,
                clickableIcons: false
            }
        }
    },
    created() {
        this.initializeGeocoder();
    },
    methods: {
        initializeGeocoder() {
            this.$nextTick(() => {
                if (typeof window !== 'undefined' && window.google && window.google.maps) {
                    // eslint-disable-next-line no-undef
                    this.geocoder = new google.maps.Geocoder();
                    // eslint-disable-next-line no-undef
                    this.directionsService = new google.maps.DirectionsService();
                    this.geocodeAddress();
                    this.fetchPantLocations();
                } else {
                    // Retry after a short delay if Google Maps isn't loaded yet
                    setTimeout(() => {
                        this.initializeGeocoder();
                    }, 500);
                }
            });
        },
        
        async geocodeAddress() {
            if (!this.targetAddress || !this.geocoder) {
                return;
            }
            
            try {
                const result = await new Promise((resolve, reject) => {
                    this.geocoder.geocode({ address: this.targetAddress }, (results, status) => {
                        // eslint-disable-next-line no-undef
                        if (status === 'OK' && results[0]) {
                            resolve(results[0]);
                        } else {
                            reject(new Error(`Could not geocode address: ${this.targetAddress}`));
                        }
                    });
                });
                
                const location = result.geometry.location;
                this.mapCenter = {
                    lat: location.lat(),
                    lng: location.lng()
                };
                

                
            } catch (error) {
                console.error('Geocoding error:', error);
                // Keep the default coordinates if geocoding fails
            }
        },
        
        fetchPantLocations() {
            PantLocationDataService.getAll()
                .then(async (response) => {
                    const locations = response.data;
                    
                    // Filter only active locations and geocode those that don't have coordinates
                    const activeLocations = locations.filter(location => location.isActive);
                    
                    const geocodedLocations = await Promise.all(
                        activeLocations.map(async (location) => {
                            if (location.latitude && location.longitude) {
                                // Already has coordinates
                                return location;
                            }
                            
                            if (!location.address) {
                                return null;
                            }
                            
                            try {
                                const coordinates = await this.geocodeLocationAddress(location.address);
                                return {
                                    ...location,
                                    latitude: coordinates.lat,
                                    longitude: coordinates.lng
                                };
                            } catch (error) {
                                return null;
                            }
                        })
                    );
                    
                    // Filter out any locations that failed to geocode
                    this.pantLocations = geocodedLocations.filter(location => location !== null);
                })
                .catch((error) => {
                    console.error('Error fetching pant locations:', error);
                });
        },
        

        
        async geocodeLocationAddress(address) {
            if (!this.geocoder) {
                throw new Error('Geocoder not initialized');
            }
            
            return new Promise((resolve, reject) => {
                // Format address for better geocoding (add Denmark if not present)
                let formattedAddress = address;
                if (!address.toLowerCase().includes('denmark') && !address.toLowerCase().includes('danmark')) {
                    formattedAddress = `${address}, Denmark`;
                }
                
                this.geocoder.geocode({ address: formattedAddress }, (results, status) => {
                    // eslint-disable-next-line no-undef
                    if (status === 'OK' && results[0]) {
                        const location = results[0].geometry.location;
                        resolve({
                            lat: location.lat(),
                            lng: location.lng()
                        });
                    } else {
                        reject(new Error(`Geocoding failed for address: ${address} (Status: ${status})`));
                    }
                });
            });
        },
        
        showLocationDetails(location) {
            this.selectedLocation = location;
            this.showDetailsDialog = true;
        },
        
        showDirections() {
            if (!this.selectedLocation || !this.directionsService) {
                return;
            }
            
            const destination = {
                lat: this.selectedLocation.latitude,
                lng: this.selectedLocation.longitude
            };
            
            this.directionsService.route(
                {
                    origin: this.mapCenter,
                    destination: destination,
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
                            
                            // Close dialog and fit map to show the route
                            this.showDetailsDialog = false;
                            this.fitMapToRoute();
                        }
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                }
            );
        },
        
        fitMapToRoute() {
            if (this.directionsPath.length === 0) return;
            
            // eslint-disable-next-line no-undef
            if (typeof google === 'undefined' || !google.maps) {
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
    }
}
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
}

.dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dialog-content {
    max-width: 500px;
    width: 90%;
    max-height: 80%;
    overflow-y: auto;
}

.location-details-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}
</style>
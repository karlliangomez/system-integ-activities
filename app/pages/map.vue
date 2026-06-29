<template>
  <div class="map-wrapper d-flex w-100 align-center justify-center">
    <div class="blur-circle circle-1"></div>
    <div class="blur-circle circle-2"></div>

    <v-card class="map-card pa-6 pa-sm-8 text-center" width="100%" max-width="540" rounded="xl">
      
      <div class="card-brand-line"></div>

      <v-card-item class="text-center justify-center pa-0 mb-6">
        <v-card-title class="text-h4 font-weight-black text-slate-indigo mb-2">
          LOCATION MAP
        </v-card-title>
        <v-card-subtitle class="text-body-1 text-medium-emphasis font-weight-medium">
          Interactive map tracking and coordinates viewer.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pa-0">
        <div class="map-container-frame">
          <div id="map"></div>
        </div>
      </v-card-text>

    </v-card>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
onMounted(async () => {
  if (import.meta.client) {
    const L = await import('leaflet');
    const map = L.map('map').setView([15.041552, 120.683248], 13);
    var marker = L.marker([15.041552, 120.683248]).addTo(map);
    marker.bindPopup("St. Nicolas College").openPopup();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }

    map.on('click', onMapClick);
  }
})


</script>

<style scoped>
/* Leaflet Stylesheet requirement */
@import 'leaflet/dist/leaflet.css';

/* Ultra-Premium Fullscreen Layout Viewport Control */
.map-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: radial-gradient(circle at 50% 50%, #f4f7ff 0%, #e3e9ff 100%);
  overflow: hidden;
  z-index: 1;
}

/* Ambient Blur Background Effects */
.blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  z-index: 0;
}
.circle-1 {
  width: 450px;
  height: 450px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  top: -10%;
  right: -5%;
}
.circle-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
  bottom: -5%;
  left: -5%;
}

/* Premium Glassmorphism Card Style */
.map-card {
  z-index: 2;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.12) !important;
  position: relative;
}

/* Subtle top branding indicator border line inside card structure */
.card-brand-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #2563eb 0%, #00c6ff 100%);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.text-slate-indigo {
  color: #1e293b;
}

/* Framed Outer Container wrapper styling for Leaflet inside Vuetify */
.map-container-frame {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

/* Responsive Map layout sizing */
#map {
  height: 500px;
  width: 100%;
  z-index: 1;
}
</style>
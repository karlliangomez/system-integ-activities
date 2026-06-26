<template>
  <div class="d-flex mx-auto align-center justify-center" style="height: 95vh;">
    <v-card class="pa-8 text-center" width="560">
      <div id="map">

      </div>

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

<style>
#map {
  height: 500px;
  width: 500px;
}
</style>
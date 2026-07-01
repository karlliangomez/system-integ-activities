<template>
  <div class="weather-wrapper d-flex w-100 align-center justify-center">
    <div class="blur-circle circle-1"></div>
    <div class="blur-circle circle-2"></div>

    <v-card class="weather-card image-bg pa-6 pa-sm-8" width="100%" max-width="540" rounded="xl" min-height="500">
      <div class="card-brand-line"></div>

      <div v-if="error" class="d-flex flex-column align-center justify-center py-12 text-center">
        <v-icon color="red-lighten-2" size="64" class="mb-4">mdi-alert-circle-outline</v-icon>
        <span class="text-h6 text-red-lighten-4 font-weight-bold mb-2">Failed to Load Weather</span>
        <v-btn color="blue-darken-1" class="text-capitalize rounded-lg font-weight-bold text-white"
          @click="fetchWeather">Retry</v-btn>
      </div>

      <div v-else class="weather-content">

        <v-card-item class="text-center justify-center pa-0 mb-5">
          <v-card-title class="text-h4 font-weight-black text-white mb-1 d-flex align-center justify-center text-glow">
            <v-icon size="28" color="red-lighten-2" class="mr-2">mdi-map-marker</v-icon>
            {{ weatherData?.location?.name || 'Loading...' }}
          </v-card-title>
          <v-card-subtitle v-if="weatherData"
            class="text-body-2 text-grey-lighten-2 font-weight-bold tracking-wide text-uppercase">
            {{ weatherData.location.region ? weatherData.location.region + ' • ' : '' }}{{ weatherData.location.country
            }}
          </v-card-subtitle>
        </v-card-item>

        <div v-if="weatherData"
          class="current-weather-hero d-flex align-center justify-space-between pa-4 mb-5 rounded-xl">
          <div class="text-left">
            <div class="text-h2 font-weight-black text-white lh-1 text-glow">
              {{ weatherData.current.temp_c}}°C
            </div>
            <div class="text-subtitle-1 font-weight-bold text-blue-lighten-3 mt-1">
              {{ weatherData.current.condition.text }}
            </div>
          </div>
          <v-avatar size="80" class="rounded-0 bg-transparent">
            <v-img :src="'https:' + weatherData.current.condition.icon" alt="Weather Condition"
              class="transparent-weather-icon"></v-img>
          </v-avatar>
        </div>

        <div v-if="weatherData" class="text-left mb-2 px-1">
          <span class="text-caption font-weight-black text-white text-uppercase tracking-wider">Hourly Tracker</span>
        </div>
        
        <div v-if="weatherData" class="hourly-scroll-container d-flex gap-3 pb-3 mb-4">
          <div v-for="time in [
            { label: '6AM', index: 6 },
            { label: '12NN', index: 12 },
            { label: '6PM', index: 18 },
            { label: '12MN', index: 0 }
          ]" :key="time.label"
            class="hourly-item d-flex flex-column align-center justify-center pa-3 rounded-xl text-center flex-grow-1">
            <span class="text-caption text-grey-lighten-2 font-weight-bold">
              {{ time.label }}
            </span>
            <v-avatar size="32" class="my-1 rounded-0 bg-transparent">
              <v-img :src="'https:' + (weatherData.forecast?.forecastday[0]?.hour?.[time.index]?.condition?.icon || '')" class="transparent-weather-icon"></v-img>
            </v-avatar>
            <span class="text-body-2 text-white">
              {{weatherData.forecast?.forecastday[0]?.hour?.[time.index]?.temp_c || 0 }}°
            </span>
          </div>
        </div>

        <v-divider v-if="weatherData" class="mb-4" color="white"></v-divider>

        <div v-if="weatherData" class="text-left mb-2 px-1">
          <span class="text-caption font-weight-black text-white text-uppercase tracking-wider">7-Day Forecast</span>
        </div>

        <div v-if="weatherData" class="forecast-scroll-container">
          <div v-for="(day, index) in weatherData.forecast.forecastday" :key="index"
            class="forecast-row d-flex align-center justify-space-between py-2 px-3 mb-2 rounded-lg">
            <div class="date-column font-weight-bold text-white text-body-2">
              {{ index === 0 ? 'Today' : 'Day ' + (index + 1) }}
            </div>

            <div class="condition-column d-flex align-center">
              <v-avatar size="36" class="mr-2 rounded-0 bg-transparent">
                <v-img :src="'https:' + day.day.condition.icon" class="transparent-weather-icon"></v-img>
              </v-avatar>
              <span
                class="text-caption text-grey-lighten-2 font-weight-medium hidden-xs d-inline-block text-truncate summary-text">
                {{ day.day.condition.text }}
              </span>
            </div>

            <div class="temp-column text-right text-body-2 font-weight-bold text-white">
              <span class="text-blue-lighten-3">{{ Math.round(day.day.maxtemp_c) }}°</span>
              <span class="mx-1 text-grey-lighten-1">/</span>
              <span class="text-grey-lighten-2 font-weight-medium">{{ Math.round(day.day.mintemp_c) }}°</span>
            </div>
          </div>
        </div>

      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const weatherData = ref(null)
const error = ref(false)

const fetchWeather = async () => {
  try {
    weatherData.value = await $fetch('http://api.weatherapi.com/v1/forecast.json?key=b868fdd339d54bd182032405262906&q=San Fernando&days=7&aqi=no&alerts=no')
  } catch (e) {
    error.value = true
  }
}

onMounted(() => {
  fetchWeather()
})
</script>

<style scoped>
.weather-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-color: white;
  /* background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%); */
  overflow: hidden;
  z-index: 1;
}

.blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  z-index: 0;
}

.circle-1 {
  width: 450px;
  height: 450px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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

.weather-card {
  z-index: 2;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
}

.image-bg {
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(30, 41, 59, 0.85)),
    url() !important;
  background-size: cover !important;
  background-position: center !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.card-brand-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6 0%, #00c6ff 100%);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.text-glow {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.transparent-weather-icon {
  mix-blend-mode: plus-lighting;
  background: transparent !important;
  background-color: transparent !important;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4));
}

:deep(.v-avatar),
:deep(.v-img__img) {
  background: transparent !important;
  background-color: transparent !important;
}

.current-weather-hero {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

.hourly-scroll-container {
  overflow-x: auto;
  display: flex;
}

.hourly-scroll-container::-webkit-scrollbar {
  height: 4px;
}

.hourly-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.hourly-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-width: 75px;
}

.forecast-scroll-container {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

.forecast-scroll-container::-webkit-scrollbar {
  width: 4px;
}

.forecast-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.forecast-row {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.forecast-row:hover {
  background: rgba(255, 255, 255, 0.15);
}

.summary-text {
  max-width: 140px;
}

.lh-1 {
  line-height: 1;
}

.gap-3 {
  gap: 12px;
}
</style>
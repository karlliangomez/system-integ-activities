<template>
  <div class="weather-wrapper d-flex w-100 align-center justify-center">
    <div class="blur-circle circle-1"></div>
    <div class="blur-circle circle-2"></div>

    <v-card class="weather-card image-bg pa-6 pa-sm-8" width="100%" max-width="540" rounded="xl" min-height="500">
      
      <div class="card-brand-line"></div>

      <div v-if="loading" class="d-flex flex-column align-center justify-center py-12">
        <v-progress-circular indeterminate color="blue-lighten-3" size="64" width="6" class="mb-4"></v-progress-circular>
        <span class="text-body-1 text-white font-weight-bold">Fetching latest weather forecast...</span>
      </div>

      <div v-else-if="error" class="d-flex flex-column align-center justify-center py-12 text-center">
        <v-icon color="red-lighten-2" size="64" class="mb-4">mdi-alert-circle-outline</v-icon>
        <span class="text-h6 text-red-lighten-4 font-weight-bold mb-2">Failed to Load Weather</span>
        <v-btn color="blue-darken-1" class="text-capitalize rounded-lg font-weight-bold text-white" @click="fetchWeather">Retry</v-btn>
      </div>

      <div v-else-if="weatherData" class="weather-content">
        
        <v-card-item class="text-center justify-center pa-0 mb-5">
          <v-card-title class="text-h4 font-weight-black text-white mb-1 d-flex align-center justify-center text-glow">
            <v-icon size="28" color="red-lighten-2" class="mr-2">mdi-map-marker</v-icon>
            {{ weatherData.location.name }}
          </v-card-title>
          <v-card-subtitle class="text-body-2 text-grey-lighten-2 font-weight-bold tracking-wide text-uppercase">
            {{ weatherData.location.region ? weatherData.location.region + ' • ' : '' }}{{ weatherData.location.country }}
          </v-card-subtitle>
        </v-card-item>

        <div class="current-weather-hero d-flex align-center justify-space-between pa-4 mb-5 rounded-xl">
          <div class="text-left">
            <div class="text-h2 font-weight-black text-white lh-1 text-glow">
              {{ Math.round(weatherData.current.temp_c) }}°C
            </div>
            <div class="text-subtitle-1 font-weight-bold text-blue-lighten-3 mt-1">
              {{ weatherData.current.condition.text }}
            </div>
          </div>
          <v-avatar size="80" class="rounded-0">
            <v-img :src="'https:' + weatherData.current.condition.icon" alt="Weather Condition"></v-img>
          </v-avatar>
        </div>

        <div class="text-left mb-2 px-1">
          <span class="text-caption font-weight-black text-white text-uppercase tracking-wider">Hourly Tracker</span>
        </div>
        <div class="hourly-scroll-container d-flex gap-3 pb-3 mb-4">
          <div 
            v-for="(hour, hIdx) in filterUpcomingHours(weatherData.forecast.forecastday[0].hour)" 
            :key="hIdx"
            class="hourly-item d-flex flex-column align-center justify-center pa-3 rounded-xl text-center"
          >
            <span class="text-caption text-grey-lighten-2 font-weight-bold">{{ formatHour(hour.time) }}</span>
            <v-avatar size="32" class="my-1">
              <v-img :src="'https:' + hour.condition.icon"></v-img>
            </v-avatar>
            <span class="text-body-2 font-weight-black text-white">{{ Math.round(hour.temp_c) }}°</span>
          </div>
        </div>

        <v-divider class="mb-4" color="white"></v-divider>

        <div class="text-left mb-2 px-1">
          <span class="text-caption font-weight-black text-white text-uppercase tracking-wider">7-Day Forecast</span>
        </div>

        <div class="forecast-scroll-container">
          <div 
            v-for="(day, index) in weatherData.forecast.forecastday" 
            :key="index"
            class="forecast-row d-flex align-center justify-space-between py-2 px-3 mb-2 rounded-lg"
          >
            <div class="date-column font-weight-bold text-white text-body-2">
              {{ index === 0 ? 'Today' : getDayName(day.date) }}
            </div>
            
            <div class="condition-column d-flex align-center">
              <v-avatar size="36" class="mr-2">
                <v-img :src="'https:' + day.day.condition.icon"></v-img>
              </v-avatar>
              <span class="text-caption text-grey-lighten-2 font-weight-medium hidden-xs d-inline-block text-truncate summary-text">
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
const loading = ref(true)
const error = ref(false)

const fetchWeather = async () => {
  loading.value = true
  error.value = false
  try {
    const data = await $fetch('https://api.weatherapi.com/v1/forecast.json?key=b868fdd339d54bd182032405262906&q=Manila&days=7&aqi=no&alerts=no')
    weatherData.value = data
  } catch (err) {
    console.error('Weather fetching error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Filters hours array down to standard consecutive intervals for visualization
const filterUpcomingHours = (hoursArray) => {
  if (!hoursArray) return []
  const currentHourIndex = new Date().getHours()
  // Captures the upcoming 6 hourly tracking segments starting relative to now
  return hoursArray.slice(currentHourIndex, currentHourIndex + 6)
}

const formatHour = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
}

const getDayName = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
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
  background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%); 
  overflow: hidden;
  z-index: 1;
}

/* Background Accents */
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

/* Premium Card Construction with Custom Image Backdrop options */
.weather-card {
  z-index: 2;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
}

.image-bg {
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(30, 41, 59, 0.85)), 
              url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000&auto=format&fit=crop') !important;
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

.current-weather-hero {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

/* Hourly Row Segment Styling styling */
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
<template>
  <div class="card-container">
    <div v-if="error" class="error-state">
      <p>Failed to Load Weather</p>
      <button @click="fetchWeather">Retry</button>
    </div>

    <div v-else>
      <header class="card-header">
        <h1>{{ weatherData?.location?.name || 'Loading...' }}</h1>
        <p v-if="weatherData?.location">
          {{ weatherData.location.region ? weatherData.location.region + ' • ' : '' }}{{ weatherData.location.country }}
        </p>
      </header>

      <main v-if="weatherData">
        <section class="current-weather">
          <div>
            <h2>{{ weatherData.current.temp_c }}°C</h2>
            <p>{{ weatherData.current.condition.text }}</p>
          </div>
          <img :src="'https:' + weatherData.current.condition.icon" alt="Weather Condition" />
        </section>

        <hr />

        <section>
          <h3>Hourly Tracker</h3>
          <div class="hourly-grid">
            <div v-for="time in [
              { label: '6am', index: 6 },
              { label: '12nn', index: 12 },
              { label: '6pm', index: 18 },
              { label: '12mn', index: 0 }
            ]" :key="time.label" class="hourly-item">
              <strong>{{ time.label }}</strong>
              <img :src="'https:' + (weatherData.forecast?.forecastday[0]?.hour?.[time.index]?.condition?.icon || '')" alt="Hourly icon" />
              <span>{{ weatherData.forecast?.forecastday[0]?.hour?.[time.index]?.temp_c || 0 }}°</span>
            </div>
          </div>
        </section>

        <hr />

        
      </main>
    </div>
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
    error.value = false
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
/* Simple Card Shell */
.card-container {
  max-width: 450px;
  margin: 20px auto;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  color: #1e293b;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
}

.card-header h1 {
  margin: 0 0 4px 0;
  font-size: 1.75rem;
}

.card-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Current Layout */
.current-weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.current-weather h2 {
  margin: 0;
  font-size: 2.5rem;
}

.current-weather p {
  margin: 4px 0 0 0;
  color: #64748b;
}

hr {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 16px 0;
}

h3 {
  font-size: 1rem;
  margin: 0 0 12px 0;
  color: #475569;
}

/* Hourly Row Layout */
.hourly-grid {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.hourly-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 8px;
  background-color: #f8fafc;
  border-radius: 8px;
  font-size: 0.875rem;
}

.hourly-item img {
  width: 32px;
  height: 32px;
  margin: 4px 0;
}

/* Forecast List Layout */
.forecast-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.forecast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 0.9rem;
}

.day-name {
  flex: 1;
}

.forecast-condition {
  display: flex;
  align-items: center;
  flex: 2;
  gap: 6px;
}

.forecast-condition img {
  width: 28px;
  height: 28px;
}

.forecast-temps {
  flex: 1;
  text-align: right;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 20px 0;
}

.error-state button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
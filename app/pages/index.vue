<template>
  <div class="dashboard-wrapper d-flex w-100 align-center justify-center">
    <div class="blur-circle circle-1"></div>
    <div class="blur-circle circle-2"></div>

    <v-card class="dashboard-card pa-8 pa-sm-10 text-center" width="100%" max-width="580" rounded="xl">
      
      <div class="avatar-container mb-6">
        <v-avatar size="120" class="profile-avatar">
          <v-img 
            :src="user?.picture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'"
            alt="User Profile"
          ></v-img>
        </v-avatar>
      </div>

      <v-card-item class="pa-0 mb-8">
        <v-card-title class="text-h4 font-weight-black text-slate-indigo mb-2">
          {{ user?.name || 'Welcome Back' }}
        </v-card-title>
        <v-chip
          color="indigo-darken-1"
          variant="flat"
          size="small"
          prepend-icon="mdi-email-outline"
          class="font-weight-medium px-4 text-body-2"
        >
          {{ user?.email || 'No email associated' }}
        </v-chip>
      </v-card-item>

      <v-card-text class="pa-0">
        <v-row dense>
          <v-col cols="12" sm="4" class="pb-2">
            <v-btn 
              @click="openMap" 
              height="75"
              block
              variant="flat"
              class="action-btn map-btn text-white font-weight-bold"
              rounded="xl"
            >
              <div class="d-flex flex-column align-center justify-center py-2">
                <v-icon size="26" class="mb-1">mdi-map-marker-radius</v-icon>
                <span class="text-caption tracking-wide font-weight-bold">Open Map</span>
              </div>
            </v-btn>
          </v-col>

          <v-col cols="12" sm="4" class="pb-2">
            <v-btn 
              @click="openQrScanner" 
              height="75"
              block
              variant="flat"
              class="action-btn qr-btn text-white font-weight-bold"
              rounded="xl"
            >
              <div class="d-flex flex-column align-center justify-center py-2">
                <v-icon size="26" class="mb-1">mdi-qrcode-scan</v-icon>
                <span class="text-caption tracking-wide font-weight-bold">QR Scanner</span>
              </div>
            </v-btn>
          </v-col>

          <v-col cols="12" sm="4" class="pb-2">
            <v-btn 
              @click="openWeather" 
              height="75"
              block
              variant="flat"
              class="action-btn weather-btn text-white font-weight-bold"
              rounded="xl"
            >
              <div class="d-flex flex-column align-center justify-center py-2">
                <v-icon size="26" class="mb-1">mdi-weather-partly-cloudy</v-icon>
                <span class="text-caption tracking-wide font-weight-bold">Weather</span>
              </div>
            </v-btn>
          </v-col>

          <v-col cols="12" class="pt-4">
            <v-btn 
              @click="logout" 
              color="red-lighten-5"
              height="50"
              block
              variant="flat"
              prepend-icon="mdi-logout-variant"
              class="logout-btn text-red-darken-2 font-weight-bold tracking-wide"
              rounded="lg"
            >
              Sign Out Securely
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
  </div>

  <div id="map"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const openMap = () => {
  navigateTo('/map')
}

const openQrScanner = () => {
  navigateTo('/qrscanner')
}

// Route target navigation method matching other components
const openWeather = () => {
  navigateTo('/weather')
}

const logout = () => {
  localStorage.removeItem('google_user')
  localStorage.removeItem('google_token')
  window.google?.accounts.id.disableAutoSelect()
  navigateTo('/login')
}

const user = ref<any>(null)

onMounted(() => {
  const savedUser = localStorage.getItem('google_user')

  if (!savedUser) {
    navigateTo('/login')
    return
  }
  user.value = JSON.parse(savedUser)
})
</script>

<style scoped>
.dashboard-wrapper {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* Glassmorphism/Neumorphism Hybrid Card Design */
.dashboard-card {
  z-index: 2;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.15) !important;
}

.text-slate-indigo {
  color: #1e293b;
}

/* Avatar Border and Multi-Layer Glow */
.avatar-container {
  display: inline-block;
  position: relative;
}
.profile-avatar {
  border: 4px solid #ffffff;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3), 
              0 0 0 4px rgba(102, 126, 234, 0.15);
  background-color: #f1f5f9;
}

/* Premium Gradient Action Buttons */
.action-btn {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
  text-transform: none !important;
}

.map-btn {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
}
.map-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4) !important;
}

.qr-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
}
.qr-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4) !important;
}

/* Weather button high-fidelity color palette matching standard atmospheric designs */
.weather-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #0284c7 100%) !important;
}
.weather-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
}

/* Logout Button Micro-interactions */
.logout-btn {
  transition: all 0.2s ease;
  text-transform: none !important;
}
.logout-btn:hover {
  background-color: #fee2e2 !important;
  color: #b91c1c !important;
}

#map {
  display: none;
}
</style>
<template>
  <ClientOnly>
    <div class="qr-wrapper d-flex w-100 align-center justify-center">
      <div class="blur-circle circle-1"></div>
      <div class="blur-circle circle-2"></div>

      <v-card class="qr-card pa-6 pa-sm-8 text-center" width="100%" max-width="540" rounded="xl">
        
        <div class="card-brand-line"></div>

        <v-card-item class="text-center justify-center pa-0 mb-6">
          <v-card-title class="text-h4 font-weight-black text-slate-indigo mb-2">
            QR SCANNER
          </v-card-title>
          <v-card-subtitle class="text-body-1 text-medium-emphasis font-weight-medium">
            Scan QR codes instantly using your device webcam.
          </v-card-subtitle>
        </v-card-item>

        <v-card-text class="pa-0">
          <div class="video-container-frame mb-4">
            <video 
              ref="videoRef" 
              playsinline 
              webkit-playsinline 
              autoplay 
              muted
            ></video>
            <div class="scanner-laser"></div>
          </div>

          <v-chip
            :color="scanResult !== 'None' ? 'green-darken-1' : 'grey-darken-2'"
            variant="flat"
            class="mb-6 font-weight-bold px-4 text-subtitle-2 w-100 justify-center py-5 rounded-lg"
          >
            <v-icon prepend size="20" class="mr-2">
              {{ scanResult !== 'None' ? 'mdi-qrcode-check' : 'mdi-qrcode-scan' }}
            </v-icon>
            Result: {{ scanResult }}
          </v-chip>

          <v-row dense>
            <v-col cols="6">
              <v-btn 
                @click="startScanner" 
                color="amber-darken-2" 
                block
                size="large"
                variant="flat"
                prepend-icon="mdi-play-circle-outline"
                class="text-capitalize font-weight-bold tracking-wide text-white rounded-lg"
              >
                Start
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn 
                @click="stopScanner" 
                color="red-lighten-1" 
                block
                size="large"
                variant="tonal"
                prepend-icon="mdi-stop-circle-outline"
                class="text-capitalize font-weight-bold tracking-wide rounded-lg"
              >
                Stop
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

      </v-card>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const qrScanner = ref(null)
const scanResult = ref('None')

onMounted(async () => {
  const QrScanner = (await import('qr-scanner')).default

  if (videoRef.value) {
    qrScanner.value = new QrScanner(
      videoRef.value,
      (result) => {
        scanResult.value = result.data
      },
      {
        onDecodeError: () => { /* Silent catch */ },
        maxScansPerSecond: 10,
        // CRITICAL VERCEL FIX: Forces the engine to bundle the worker code inline 
        // instead of searching for an external file path that doesn't exist on Vercel
        worker: 'inline' 
      }
    )
  }
})

const startScanner = async () => {
  if (qrScanner.value) {
    await qrScanner.value.start().catch(err => {
      console.error('Camera initialization error:', err)
      alert('Camera access failed. Ensure you granted permissions and are using HTTPS.')
    })
  }
}

const stopScanner = () => {
  if (qrScanner.value) {
    qrScanner.value.stop()
    scanResult.value = 'None'
  }
}

onBeforeUnmount(() => {
  if (qrScanner.value) {
    qrScanner.value.destroy()
  }
})
</script>

<style scoped>
/* Ultra-Premium Fullscreen Layout Viewport Control */
.qr-wrapper {
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); /* Amber accent matching QR themes */
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
.qr-card {
  z-index: 2;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(245, 158, 11, 0.12) !important;
  position: relative;
}

/* Subtle top branding indicator border line inside card structure */
.card-brand-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #f59e0b 0%, #00c6ff 100%);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.text-slate-indigo {
  color: #1e293b;
}

/* Camera Frame Container Layout Viewport Sizing */
.video-container-frame {
  position: relative;
  width: 100%;
  height: 320px;
  background-color: #000000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Glowing Scanning Line Laser Animation Effect */
.video-container-frame::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #f59e0b, transparent);
  animation: scan-move 3s linear infinite;
  z-index: 3;
}

@keyframes scan-move {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
</style>
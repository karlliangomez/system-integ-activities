
<template>
  <ClientOnly>
    <div class="page-wrapper">
      <h2>Scan from WebCam:</h2>

      <div class="video-frame">
        <video ref="videoRef"></video>
      </div>

      <p><strong>Detected QR code:</strong> {{ scanResult }}</p>

      <div class="button-row">
        <button @click="startScanner">Start</button>
        <button @click="stopScanner">Stop</button>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.page-wrapper {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
  text-align: left;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.video-frame {
  width: 100%;
  max-width: 800px;
  background: #000;
  margin-bottom: 1rem;
}

video {
  width: 100%;
  height: auto;
  display: block;
}

p {
  font-size: 1rem;
  margin: 0.5rem 0;
}

button {
  font-family: inherit;
  font-size: 0.9rem;
  padding: 2px 8px;
  margin-right: 5px;
  cursor: pointer;
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const qrScanner = ref(null)
const scanResult = ref('None')

onMounted(async () => {
  // Dynamically import qr-scanner to prevent Nuxt SSR crashes
  const QrScanner = (await import('qr-scanner')).default

  if (videoRef.value) {
    qrScanner.value = new QrScanner(
      videoRef.value,
      (result) => {
        scanResult.value = result.data
      },
      {
        onDecodeError: () => { /* Silent catch to stop console flooding */ },
        maxScansPerSecond: 10
      }
    )
  }
})

// Control Handlers
const startScanner = async () => {
  if (qrScanner.value) {
    await qrScanner.value.start().catch(err => console.error('Camera access denied or missing:', err))
  }
}

const stopScanner = () => {
  if (qrScanner.value) {
    qrScanner.value.stop()
    scanResult.value = 'None' // Resets the result when stopped
  }
}

// Memory clean-up when leaving the page
onBeforeUnmount(() => {
  if (qrScanner.value) {
    qrScanner.value.destroy()
  }
})
</script>

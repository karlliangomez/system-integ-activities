

<template>
  <ClientOnly>
    <div class="page-wrapper">
      <h2>Scan from WebCam:</h2>

      <div class="video-frame">
        <video 
          ref="videoRef" 
          playsinline 
          webkit-playsinline 
          autoplay 
          muted
        ></video>
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
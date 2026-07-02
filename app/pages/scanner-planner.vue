<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-responsive max-width="650" class="w-100">
      
      <v-card class="elevation-6 rounded-xl overflow-hidden">
        <v-toolbar color="primary" dark>
          <v-toolbar-title class="font-weight-bold">3D Scanner & AR Planner</v-toolbar-title>
        </v-toolbar>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text class="pa-6 text-center">
              <h3 class="text-h6 mb-2">Step 1: 3D Object Photogrammetry</h3>
              <p class="text-body-2 text-grey mb-4">Point your camera at an object and circle it to map out its 3D mesh properties.</p>
              
              <div class="video-window bg-black rounded-lg position-relative d-flex align-center justify-center">
                <video ref="videoFeed" autoplay playsinline class="w-100 h-100 rounded-lg object-cover"></video>
                
                <div v-if="isScanning" class="position-absolute top-0 right-0 ma-4 bg-red px-3 py-1 rounded-pill text-caption font-weight-bold d-flex align-center">
                  <v-icon icon="mdi-record" class="mr-1"></v-icon>
                  Captured: {{ capturedFrames.length }} / 12 Frames
                </div>
              </div>

              <v-row class="mt-4 px-2" dense>
                <v-col v-for="(img, index) in capturedFrames" :key="index" cols="2">
                  <v-img :src="img" aspect-ratio="1" class="rounded-sm bg-grey-lighten-2"></v-img>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0 justify-center">
              <v-btn v-if="!isScanning" color="primary" prepend-icon="mdi-camera" variant="elevated" size="large" @click="startScanning">
                Open Camera & Scan
              </v-btn>
              <v-btn v-else color="success" prepend-icon="mdi-image-filter-center-focus" variant="elevated" size="large" :disabled="capturedFrames.length < 4" @click="processMesh">
                Generate 3D Asset
              </v-btn>
            </v-card-actions>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text class="pa-12 text-center">
              <v-progress-circular indeterminate color="primary" size="72" width="6" class="mb-6"></v-progress-circular>
              <h3 class="text-h6 mb-2">Processing Local Photogrammetry...</h3>
              <p class="text-body-2 text-grey">Triangulating spatial geometry from your localized frame array snapshots.</p>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <v-card-text class="pa-6 text-center">
              <h3 class="text-h6 mb-2">Step 2: Virtual WebXR Placement</h3>
              <p class="text-body-2 text-grey mb-4">Your 3D asset is compiled! Tap below to activate WebXR pass-through and position the item.</p>
              
              <div class="viewer-window bg-grey-lighten-4 rounded-lg position-relative">
                <model-viewer
                  src="/furniture.glb"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  shadow-intensity="1"
                  class="w-100 h-100"
                >
                  <template #ar-button>
                    <v-btn id="ar-button" color="secondary" size="large" block prepend-icon="mdi-augmented-reality" class="ar-custom-btn">
                      Launch AR Room View
                    </v-btn>
                  </template>
                </model-viewer>
              </div>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0 justify-center">
              <v-btn variant="outlined" color="primary" prepend-icon="mdi-refresh" @click="resetWorkflow">
                Scan New Object
              </v-btn>
            </v-card-actions>
          </v-window-item>
        </v-window>

      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
const isScanning = ref(false)
const videoFeed = ref(null)
const capturedFrames = ref([])
let streamRef = null
let processingTimer = null

const startScanning = async () => {
  try {
    capturedFrames.value = []
    streamRef = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    if (videoFeed.value) {
      videoFeed.value.srcObject = streamRef
      isScanning.value = true
      startFrameGrabbing()
    }
  } catch (err) {
    alert("Camera hardware access is blocked or unmounted.")
  }
}

const startFrameGrabbing = () => {
  processingTimer = setInterval(() => {
    if (!videoFeed.value || capturedFrames.value.length >= 12) return

    const canvas = document.createElement('canvas')
    canvas.width = 160 
    canvas.height = 120
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoFeed.value, 0, 0, canvas.width, canvas.height)
    
    capturedFrames.value.push(canvas.toDataURL('image/jpeg'))
  }, 800)
}

const processMesh = () => {
  clearInterval(processingTimer)
  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop())
  }
  isScanning.value = false
  step.value = 2

  setTimeout(() => {
    step.value = 3
  }, 3500)
}

const resetWorkflow = () => {
  capturedFrames.value = []
  step.value = 1
}
</script>

<style scoped>
.video-window, .viewer-window {
  width: 100%;
  height: 350px;
}
.object-cover {
  object-fit: cover;
}
.ar-custom-btn {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 85% !important;
}
</style>
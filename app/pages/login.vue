<template>
  <div class="login-wrapper d-flex w-100 align-center justify-center">
    <div class="blur-circle circle-1"></div>
    <div class="blur-circle circle-2"></div>

    <v-card class="login-card pa-8 pa-sm-10" width="100%" max-width="540" rounded="xl">
      
      <div class="card-brand-line"></div>

      <v-card-item class="text-center justify-center pa-0 mb-8">
        <v-card-title class="text-h4 font-weight-black text-slate-indigo mb-2">
          LOGIN
        </v-card-title>
        <v-card-subtitle class="text-body-1 text-medium-emphasis font-weight-medium">
          Welcome back! Please enter your details.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pa-0">
        <v-text-field 
          label="Username"
          variant="outlined"
          density="comfortable"
          color="green-darken-1"
          prepend-inner-icon="mdi-account-outline"
          class="mb-3 custom-input"
          rounded="lg"
        ></v-text-field>

        <v-text-field 
          type="password" 
          label="Password"
          variant="outlined"
          density="comfortable"
          color="green-darken-1"
          prepend-inner-icon="mdi-lock-outline"
          class="mb-6 custom-input"
          rounded="lg"
        ></v-text-field>

        <v-btn 
          block 
          color="green-darken-1"
          size="large"
          height="54"
          elevation="0"
          class="text-capitalize font-weight-bold signin-btn text-white rounded-lg"
        >
          Sign In
        </v-btn>

        <div class="d-flex align-center my-6">
          <v-divider></v-divider>
          <span class="mx-4 text-caption text-disabled font-weight-black">OR</span>
          <v-divider></v-divider>
        </div>

        <v-btn 
          block 
          variant="outlined" 
          color="grey-darken-3"
          size="large"
          height="54"
          prepend-icon="mdi-google" 
          class="text-capitalize font-weight-bold google-btn rounded-lg"
          @click="loginWithGoogle"
        >
          Sign in with Google
        </v-btn>
      </v-card-text>

    </v-card>
  </div>
</template>

<script lang="ts" setup>

//@ts-nocheck

definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()

declare global {
  interface Window {
    google: any
  }
}

const loginWithGoogle = () => {
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: 'openid email profile',
    callback: async (response: any) => {
      const userInfo = await $fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`
        }
      })
      localStorage.setItem('google_user', JSON.stringify(userInfo))
      localStorage.setItem('google_token', response.access_token)

      navigateTo('/')
    }
  })

  client.requestAccessToken()
}

</script>

<style scoped>
/* Ultra-Premium Fullscreen Layout Viewport Control */
.login-wrapper {
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
  background: linear-gradient(135deg, #81c784 0%, #2e7d32 100%); 
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

/* Premium Glassmorphism Card Style (Updated width context matches dashboard) */
.login-card {
  z-index: 2;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 50px rgba(46, 125, 50, 0.12) !important;
  position: relative;
}

/* Subtle top branding indicator border line inside card structure */
.card-brand-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #43a047 0%, #00c6ff 100%);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.text-slate-indigo {
  color: #1e293b;
}

/* Polished Embedded Inputs background adjustments */
.custom-input :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.6) !important;
}

/* High Performance Button Gradients & Hover states */
.signin-btn {
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.2) !important;
}
.signin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 125, 50, 0.35) !important;
}

.google-btn {
  background-color: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  transition: all 0.2s ease !important;
}
.google-btn:hover {
  background-color: rgba(255, 255, 255, 1) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}
</style>
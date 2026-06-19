<template>
  <div class="d-flex mx-auto justify-center align-center" style="height: 95vh;">
    <v-card class="pa-8 text-center" width="344">
      <v-card-title>

        <h1>LOGIN</h1>
      </v-card-title>
      <v-responsive class="mx-auto" max-width="344">

        <v-text-field label="Username"></v-text-field>

        <v-text-field type="password" label="Password"></v-text-field>

        <v-btn block color="green">
          Sign In
        </v-btn>
        <br>
        <v-btn block variant="outlined" prepend-icon="mdi-google" @click="loginWithGoogle">
          Sign in with Google
        </v-btn>
      </v-responsive>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck

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
      localStorage.setItem('google.user', JSON.stringify(userInfo))
      localStorage.setItem('google_token', response.access_token)

      navigateTo('/')
    }
  })

  client.requestAccessToken()
}

</script>

<style></style>
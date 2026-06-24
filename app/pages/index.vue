<template>
  <div class="d-flex mx-auto align-center justify-center" style="height: 95vh;">

    <v-card class="pa-8 text-center" width="344">

      <v-avatar size="100">
      <v-img :src="user?.picture"
        

      ></v-img>
    </v-avatar>


      <h1>
        {{ user?.name }}
      </h1>
      <p>{{ user?.email }}</p>
      <v-btn @click="logout" color="red">Log out</v-btn>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: 'auth'
})

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

<style></style>
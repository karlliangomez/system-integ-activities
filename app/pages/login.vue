<template>
  <div class="d-flex mx-auto justify-center align-center" style="height: 95vh;">
    <v-card class="pa-8 text-center" width="344" >
      <v-card-title>
        Login
      </v-card-title>
      <v-responsive class="mx-auto" max-width="344">

        <v-text-field label="Username"></v-text-field>
        <br>
        <v-text-field type="password" label="Password"></v-text-field>
        <br>
        <v-btn block color="green">
          Sign In
        </v-btn>
        <br>
        <v-btn block variant="outlined" prepend-icon="mdi-google">
          Sign in with Google
        </v-btn>
      </v-responsive>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>
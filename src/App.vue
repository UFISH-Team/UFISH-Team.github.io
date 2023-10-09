<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'

export default {
  data: () => ({
    drawer: false,
  }),
}
</script>

<template>
  <v-app>
    <v-app-bar color="info">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          color="white"
          @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
        <v-btn icon>
          <a href="https://github.com/UFISH-Team/U-FISH">
            <v-icon color="white">mdi-github</v-icon>
          </a>
        </v-btn>
      </template>

      <v-app-bar-title>U-FISH 🎣</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>

</template>

<style scoped>
</style>

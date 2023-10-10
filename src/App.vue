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
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" value="home"></v-list-item>
        <v-list-item prepend-icon="mdi-database" title="Dataset" value="dataset"></v-list-item>
        <v-list-item prepend-icon="mdi-play-circle-outline" title="Predict" value="predict"></v-list-item>
        <v-list-item prepend-icon="mdi-information-outline" title="About" value="about"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>

</template>

<style scoped>
</style>

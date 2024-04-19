<script lang="ts">
import { RouterView } from 'vue-router'
import { isPluginMode } from '@/utils';

export default {
  data: () => ({
    drawer: false,
  }),
  computed: {
    isPluginMode() {
      return isPluginMode()
    }
  },
  methods: {
    gotoPage(page: string) {
      this.$router.push({ name: page })
    }
  },
  components: {
    RouterView
  }
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
          <a href="https://github.com/UFISH-Team/">
            <v-icon color="white">mdi-github</v-icon>
          </a>
        </v-btn>
      </template>

      <v-app-bar-title>U-FISH 🎣</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item prepend-icon="mdi-home"
          @click="()=>{gotoPage('home')}"
          title="Home" value="home"></v-list-item>
        <v-list-item prepend-icon="mdi-database"
          @click="()=>{gotoPage('dataset')}"
          title="Dataset" value="dataset"></v-list-item>
        <v-list-item prepend-icon="mdi-play-circle-outline"
          @click="()=>{gotoPage('predict')}"
          title="Predict" value="predict"></v-list-item>
        <v-list-item prepend-icon="mdi-information-outline"
          @click="()=>{gotoPage('about')}"
          title="About" value="about"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="container">
        <RouterView />
        <div style="margin-top: 1em; height: 2em;"></div>
        <div class="footer" v-if="!isPluginMode">2023 U-FISH Team</div>
      </div>
    </v-main>
  </v-app>

</template>

<style scoped>
.container {
  margin-top: 1em;
  display: grid;
  place-items: center;
}
.footer {
  position: absolute;
  bottom: 1em;
  font-size: 0.8em;
  color: #888;
}
</style>

<template>
  <h1>Run U-FISH in browser</h1>
  <div class="pred-container">
    <h2 class="left-align-item">Viewer</h2>
    <div id="kaibu-container"></div>
  </div>
</template>

<script lang="ts">
import { useImJoyStore } from '@/stores/imjoy';

export default {
  created() {
    this.loadKaibu()
  },
  methods: {
    async loadKaibu() {
      const { imjoy } = useImJoyStore()
      if (imjoy !== null) {
        imjoy.api.log("Hello from Imjoy!")
        const viewer = await imjoy.api.createWindow({
          src: "https://kaibu.org/#/app", name: "Kaibu",
          window_id: "kaibu-container"
        })
        await viewer.add_image("https://raw.githubusercontent.com/imjoy-team/kaibu/master/public/static/img/kaibu-logo.gif?sanitize=true")
      } else {
        setTimeout(this.loadKaibu, 1000)
      }
    }
  }
}
</script>

<style scoped>
.pred-container {
  width: 90%;
}
.left-align-item {
  align-self: start;
  justify-content: start;
}
#kaibu-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
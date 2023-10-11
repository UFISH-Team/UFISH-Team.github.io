<template>
  <h1>Run U-FISH in browser</h1>
  <v-card class="pred-container">
    <div class="buttons">
      <v-btn>Load image</v-btn>
      <v-btn @click="loadExample">Example image</v-btn>
      <v-btn>Run</v-btn>
      <v-btn>Download</v-btn>
    </div>
    <div id="kaibu-container"></div>

    <v-overlay
      v-model="overlay"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script lang="ts">
import { useImJoyStore } from '@/stores/imjoy';

export default {
  data: () => ({
    overlay: false,
    plugin: null,
  }),
  created() {
    this.loadPlugin()
  },
  methods: {
    async loadPlugin() {
      const { imjoy } = useImJoyStore()
      this.overlay = true
      if (imjoy !== null) {
        imjoy.api.log("Hello from Imjoy!")
        const url = window.location.origin + "/plugins/ufish.imjoy.html"
        this.plugin = await imjoy.api.loadPlugin({
          src: url,
        })
        this.overlay = false
      } else {
        setTimeout(this.loadPlugin, 1000)
      }
    },

    async loadExample() {
      this.overlay = true
      if (this.plugin !== null) {
        await (this.plugin as any)?.add_image("https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif")
        this.overlay = false
      } else {
        setTimeout(this.loadExample, 1000)
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
.buttons {
  display: flex;
  justify-content: center;
  margin: 1em;
  gap: 1em;
}
#kaibu-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  overflow: auto;
  resize: both;
  margin-left: auto;
  margin-right: auto;
}
</style>
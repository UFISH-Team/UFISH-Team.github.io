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
import {
  useImJoyStore,
  useKaibuViewer,
} from '@/stores/imjoy';

export default {
  data: () => ({
    overlay: false,
  }),
  created() {
    this.loadKaibu()
  },
  methods: {
    async loadKaibu() {
      const { imjoy } = useImJoyStore()
      this.overlay = true
      if (imjoy !== null) {
        imjoy.api.log("Hello from Imjoy!")
        const viewer = await imjoy.api.createWindow({
          src: "https://kaibu.org/#/app", name: "Kaibu",
          window_id: "kaibu-container"
        })
        const { setViewer } = useKaibuViewer()
        setViewer(viewer)
        this.overlay = false
      } else {
        setTimeout(this.loadKaibu, 1000)
      }
    },

    async loadExample() {
      const { viewer } = useKaibuViewer()
      this.overlay = true
      if (viewer !== null) {
        await viewer.add_image("https://raw.githubusercontent.com/imjoy-team/kaibu/master/public/static/img/kaibu-logo.gif?sanitize=true")
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
<template>
  <h1>Run U-FISH in browser</h1>
  <v-card class="pred-container">
    <div class="buttons">
      <v-btn @click="loadLocalImage">Load image</v-btn>
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
    plugin: null as any,
    modelLoaded: false,
    model_url: window.location.origin + "/model/v1.0-alldata-ufish_c32.onnx",
    test_data_url: "https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif",
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
        this.plugin = await imjoy.api.loadPlugin({ src: url, })
        this.overlay = false
      } else {
        setTimeout(this.loadPlugin, 1000)
      }
    },

    async loadExample() {
      this.overlay = true
      if (this.plugin !== null) {
        const res = await fetch(this.test_data_url)
        const data = await res.arrayBuffer()
        const fileName = this.test_data_url.split('/').pop()
        await this.plugin.view_img_from_bytes(fileName, data)
        this.overlay = false
      } else {
        setTimeout(this.loadExample, 1000)
      }
    },

    async loadLocalImage() {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.style.display = 'none'
      fileInput.onchange = async () => {
        if (
          fileInput.files === null ||
          fileInput.files.length === 0
          ) {
            return
          }
        const file = fileInput.files[0]
        const reader = new FileReader()
        reader.onload = async () => {
          const data = reader.result
          const fileName = file.name
          await this.plugin.view_img_from_bytes(fileName, data)
        }
        reader.readAsArrayBuffer(file)
      }
      fileInput.click()
    },

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
  height: 720px;
  border: 1px solid #ccc;
  overflow: auto;
  resize: both;
  margin-left: auto;
  margin-right: auto;
}
</style>
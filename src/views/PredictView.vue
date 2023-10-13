<template>
  <h1>Run U-FISH in browser</h1>
  <v-card class="pred-container">
    <div class="buttons">
      <v-btn @click="loadLocalImage">Load image</v-btn>
      <v-btn @click="loadExample">Example image</v-btn>
      <v-btn @click="run" :disabled="!hasData">Run</v-btn>
      <v-btn :disabled="hasOutput">Download</v-btn>
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
import * as ort from 'onnxruntime-web';

declare const nj: any;

export default {
  data: () => ({
    loadingData: false,
    hasData: false,
    hasOutput: false,
    running: false,
    plugin: null as any,
    modelLoaded: false,
    modelUrl: window.location.origin + "/model/v1.0-alldata-ufish_c32.onnx",
    ortSession: null as any,
    test_data_url: "https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif",
  }),
  computed: {
    overlay() {
      return (
        (this.plugin === null) ||
        (this.ortSession === null) ||
        (this.loadingData) ||
        (this.running)
      )
    }
  },
  created() {
    this.loadPlugin()
    this.loadOrtSession()
  },
  methods: {
    async loadPlugin() {
      const { imjoy } = useImJoyStore()
      if (imjoy !== null) {
        imjoy.api.log("Hello from Imjoy!")
        const url = window.location.origin + "/plugins/ufish.imjoy.html"
        this.plugin = await imjoy.api.loadPlugin({ src: url, })
      } else {
        setTimeout(this.loadPlugin, 1000)
      }
    },

    async loadOrtSession() {
      const session = await ort.InferenceSession.create(
        this.modelUrl,
        { executionProviders: ['wasm'] })
      this.ortSession = session
    },

    async loadExample() {
      this.loadingData = true
      if (this.plugin !== null) {
        const res = await fetch(this.test_data_url)
        const data = await res.arrayBuffer()
        const fileName = this.test_data_url.split('/').pop()
        await this.plugin.view_img_from_bytes(fileName, data)
        this.loadingData = false
        this.hasData = true
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
          this.loadingData = true
          await this.plugin.view_img_from_bytes(fileName, data)
          this.loadingData = false
          this.hasData = true
        }
        reader.readAsArrayBuffer(file)
      }
      fileInput.click()
    },

    async scaleImage() {
      const image = await this.plugin.scale_image_to_bytes()
      return image
    },

    async infer_2d(image: any) {
        console.log(image)
        if (image.shape.length != 2) {
            throw new Error("image must be 2d")
        }
        const shape = image.shape
        const flatShape = [shape[0] * shape[1]]
        const flatten = image.reshape(flatShape)
        const input = new ort.Tensor(
            new Float32Array(flatten.tolist()), [1, 1].concat(image.shape))
        const session = this.ortSession
        const output = await session.run({input})
        const out_image = nj.array(output.data).reshape(shape)
        return out_image
    },

    async run() {
      const scaledImage = await this.scaleImage()
      debugger
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
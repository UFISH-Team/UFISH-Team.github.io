<template>
  <h1>Run U-FISH in browser</h1>
  <div class="info-panel">
    <p>
      Hello, this is a demo of U-FISH running in the browser.
    </p>
    <p>
      It's only support 2D images for now.
      If you want to run on more complex images,
      please use the <a href="https://github.com/UFISH-Team/U-FISH">local version</a>.
    </p>
  </div>
  <div class="info-panel" id="run-info" v-text="runInfoText" ></div>
  <v-card class="pred-container">
    <div class="buttons">
      <v-btn @click="loadLocalImage">Load image</v-btn>
      <v-btn @click="loadExample">Example image</v-btn>
      <v-btn @click="run" :disabled="!hasData">Run</v-btn>
      <v-btn @click="download" :disabled="!hasOutput">Download</v-btn>
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
import * as ort from 'onnxruntime-web';

declare var imjoy: any;

function downloadBlob(
    content: any, filename: string, contentType: string
  ) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}


export default {
  data: () => ({
    loadingData: false,
    hasData: false,
    hasError: false,
    running: false,
    plugin: null as any,
    modelLoaded: false,
    modelUrl: window.location.origin + "/model/v1.0-alldata-ufish_c32.onnx",
    ortSession: null as ort.InferenceSession | null,
    test_data_url: "https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif",
    output: null as any,
    runInfoText: "loading...",
  }),
  computed: {
    overlay() {
      return (
        (this.plugin === null) ||
        (this.ortSession === null) ||
        (this.loadingData) ||
        (this.running)
      )
    },
    hasOutput() {
      return this.output !== null
    }
  },
  created() {
    const loadPluginPromise = this.loadPlugin()
    loadPluginPromise.then(() => {
      this.runInfoText = "Plugin loaded"
    })
    loadPluginPromise.catch((e) => {
      this.runInfoText = "Failed to load plugin, see console for more detail."
      console.log(e)
      this.hasError = true
    })
    const loadSessionPromise = this.loadOrtSession()
    loadSessionPromise.catch((e) => {
      this.runInfoText = "Failed to load ONNX session, see console for more detail."
      console.log(e)
      this.hasError = true
    })
  },
  methods: {
    async loadPlugin() {
      if (imjoy !== null) {
        imjoy.api.log("Hello from Imjoy!")
        const url = window.location.origin + "/plugins/ufish.imjoy.html"
        this.plugin = await imjoy.api.loadPlugin({ src: url, })
      } else {
        setTimeout(this.loadPlugin, 1000)
      }
    },

    async loadOrtSession() {
      ort.env.wasm.numThreads = 4
      ort.env.wasm.simd = true
      const session = await ort.InferenceSession.create(
        this.modelUrl,
        { executionProviders: ['wasm'] })
      this.ortSession = session
    },

    async loadExample() {
      this.loadingData = true
      if (this.plugin !== null) {
        const res = await fetch(this.test_data_url)
        if (!res.ok) {
          this.loadingData = false
          this.runInfoText = `Failed to load example image, status: ${res.status}`
          this.hasError = true
          return
        }
        const data = await res.arrayBuffer()
        const fileName = this.test_data_url.split('/').pop()
        const shape = await this.plugin.view_img_from_bytes(fileName, data)
        this.runInfoText = `Image loaded, shape: ${shape}`
        this.loadingData = false
        this.hasData = true
        this.hasError = false
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
          const shape = await this.plugin.view_img_from_bytes(fileName, data)
          if (shape.length !== 2) {
            this.runInfoText = `Image loaded, shape: ${shape}, but it's not 2D, please try another image.`
            this.hasError = true
          } else {
            this.runInfoText = `Image loaded, shape: ${shape}`
            this.hasError = false
          }
          this.loadingData = false
          this.hasData = true
        }
        reader.readAsArrayBuffer(file)
      }
      fileInput.click()
    },

    async scaleImage() {
      const image = await this.plugin.scale_image()
      return image
    },

    async infer_2d(input: ort.Tensor) {
        if (input.type !== 'float32') {
          throw new Error('Input tensor must be of type float32')
        }
        if (input.dims.length !== 2) {
          throw new Error('Input tensor must be 2D')
        }
        const input4d = input.reshape([1, 1, input.dims[0], input.dims[1]])
        const session = this.ortSession
        if (session === null) {
          throw new Error('ONNX session not loaded')
        }
        const feeds = {'input': input4d}
        const { output } = await session.run(feeds)
        const out = output.reshape([output.dims[2], output.dims[3]])
        return out
    },

    async run() {
      this.running = true
      const sImg = await this.scaleImage()
      const f32data = new Float32Array(sImg._rvalue)
      const input = new ort.Tensor(
        sImg._rdtype, f32data, sImg._rshape);
      let output;
      try {
        output = await this.infer_2d(input)
        const outImg = {
          _rtype: "ndarray",
          _rdtype: output.type,
          _rshape: output.dims,
          _rvalue: (output.data as Float32Array).buffer
        }
        const [enhBytes, coords, numSpots] = await this.plugin.process_enhanced(outImg)
        this.output = {
          enhanced: enhBytes,
          coords: coords
        }
        this.runInfoText = `Done, ${numSpots} spots detected.`
        this.running = false
      } catch (error) {
        console.log(error)
        this.runInfoText = "Failed to run inference, see console for more detail."
        this.running = false
        this.hasError = true
        return
      }
    },

    async download() {
      downloadBlob(this.output.enhanced, "enhanced.tif", "image/tiff")
      downloadBlob(this.output.coords, "coords.csv", "text/csv;charset=utf-8;")
    }

  }
}
</script>

<style scoped>
.pred-container {
  width: 80%;
}
.left-align-item {
  align-self: start;
  justify-content: start;
}
.info-panel {
  text-align: center;
  color: #888;
}
#run-info {
  margin-top: 1em;
  color: v-bind("hasError ? '#f00' : '#888'")
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
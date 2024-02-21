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
    <div id="kaibu-container" v-if="showViewer"></div>

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
import { getImjoyApi, isPluginMode, downloadBlob, removeNpArrProxy } from '@/utils';
import { ref, onMounted, watch } from 'vue';
import { useRunStore } from '@/stores/run';

export default {
  setup() {
    const modelUrl = window.location.origin + "/model/v1.0-alldata-ufish_c32.onnx"
    const test_data_url = "https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif"

    const running = ref(false)
    const plugin = ref(null as any)
    const ortSession = ref(null as ort.InferenceSession | null)
    const runInfoText = ref("loading...")
    const hasError = ref(false)
    const hasData = ref(false)
    const output = ref(null as any)
    const loadingData = ref(false)
    const runStore = useRunStore()

    async function loadPlugin() {
      const imjoy_api = await getImjoyApi()
      imjoy_api.log("Hello from Imjoy!")
      const url = window.location.origin + "/plugins/ufish.imjoy.html"
      plugin.value = await imjoy_api.loadPlugin({ src: url, })
    }

    async function infer_2d(input: ort.Tensor) {
        if (input.type !== 'float32') {
          throw new Error('Input tensor must be of type float32')
        }
        if (input.dims.length !== 2) {
          throw new Error('Input tensor must be 2D')
        }
        const input4d = input.reshape([1, 1, input.dims[0], input.dims[1]])
        const session = ortSession
        if (session.value === null) {
          throw new Error('ONNX session not loaded')
        }
        const feeds = {'input': input4d}
        const { output } = await session.value.run(feeds)
        const out = output.reshape([output.dims[2], output.dims[3]])
        return out
    }

    async function loadOrtSession() {
      ort.env.wasm.numThreads = 4
      ort.env.wasm.simd = true
      const session = await ort.InferenceSession.create(
        modelUrl,
        { executionProviders: ['wasm'] })
      ortSession.value = session
    }

    onMounted(() => {
      const plugP = loadPlugin()
      plugP.then(() => {
        runInfoText.value = "Plugin loaded"
        runStore.setRunable(true)
      })
      plugP.catch((e) => {
        runInfoText.value = "Failed to load plugin, see console for more detail."
        console.log(e)
        hasError.value = true
      })

      loadOrtSession().catch((e) => {
        runInfoText.value = "Failed to load ONNX session, see console for more detail."
        console.log(e)
        hasError.value = true
      })
    })

    function checkInputShape(shape: number[]) {
      if (shape.length === 3 && shape[2] === 3) {
        runInfoText.value = `Image loaded, shape: ${shape}. Will treat it as an RGB image.`
        hasError.value = false
      } else if (shape.length !== 2) {
        runInfoText.value = `Image loaded, shape: ${shape}, but it's not 2D, please try another image.`
        hasError.value = true
      } else {
        runInfoText.value = `Image loaded, shape: ${shape}`
        hasError.value = false
      }
    }

    async function run() {
      running.value = true
      try {
        const sImg = await plugin.value.scale_image()
        const f32data = new Float32Array(sImg._rvalue)
        const input = new ort.Tensor(
        sImg._rdtype, f32data, sImg._rshape);
        const modelOut = await infer_2d(input)
        const outImg = {
          _rtype: "ndarray",
          _rdtype: modelOut.type,
          _rshape: modelOut.dims,
          _rvalue: (modelOut.data as Float32Array).buffer
        }
        const [enhBytes, coords, numSpots] = await plugin.value.process_enhanced(outImg)
        output.value = {
          enhanced: enhBytes,
          coords: coords
        }

        if (isPluginMode()) {
          runStore.setOutput({
            enhanced: outImg,
            spots: coords,
          })
        }
        runInfoText.value = `Done, ${numSpots} spots detected.`
        running.value = false
      } catch (error) {
        console.log(error)
        runInfoText.value = "Failed to run inference, see console for more detail."
        running.value = false
        hasError.value = true
        return
      }
    }

    watch(() => runStore.runQueryCount, async () => {
      if (runStore.runQueryCount > 0) {
        console.log('running from store')
        await run()
      }
    })

    watch(() => running.value, () => {
      runStore.setRunable(!running.value)
    })

    watch(() => runStore.inputImage, async (newVal: any) => {
      if (newVal !== null) {
        try {
          const data = removeNpArrProxy(newVal.data)
          const shape = await plugin.value.view_img(data, newVal.name)
          checkInputShape(shape)
          hasData.value = true
          output.value = null
        } catch (error) {
          runInfoText.value = "Failed to load image, see console for more detail."
          console.log(error)
          hasError.value = true
        }
        runStore.clearInputImage()
      }
    })

    async function loadLocalImage() {
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
          loadingData.value = true
          const shape = await plugin.value.view_img_from_bytes(fileName, data)
          checkInputShape(shape)
          loadingData.value = false
          hasData.value = true
          output.value = null
        }
        reader.readAsArrayBuffer(file)
      }
      fileInput.click()
    }

    async function loadFromUrl(url: string) {
      loadingData.value = true
      if (plugin.value !== null) {
        const res = await fetch(url)
        if (!res.ok) {
          loadingData.value = false
          runInfoText.value = `Failed to load example image, status: ${res.status}`
          hasError.value = true
          return
        }
        const data = await res.arrayBuffer()
        const fileName = test_data_url.split('/').pop()
        const shape = await plugin.value.view_img_from_bytes(fileName, data)
        runInfoText.value = `Image loaded, shape: ${shape}`
        loadingData.value = false
        hasData.value = true
        hasError.value = false
        output.value = null
      } else {
        setTimeout(() => loadFromUrl(url), 1000)
      }
    }

    const loadExample = () => loadFromUrl(test_data_url)

    async function download() {
      downloadBlob(output.value.enhanced, "enhanced.tif", "image/tiff")
      downloadBlob(output.value.coords, "coords.csv", "text/csv;charset=utf-8;")
    }

    async function fetchImageFromUrl(url: string) {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to fetch image from ${url}, status: ${res.status}`)
      }
      const data = await res.arrayBuffer()
      const fileName = url.split('/').pop()
      const arr = await plugin.value.load_image_from_bytes(fileName, data)
      return arr
    }

    watch(() => runStore.imageUrl, async (newVal) => {
      if (newVal !== null) {
        try {
          const arr = await fetchImageFromUrl(newVal)
          runStore.setFetchedImage(arr)
          runStore.setImageUrl(null)
        } catch (error) {
          console.log(error)
          runStore.setFetchedImage(null)
          runStore.setImageUrl(null)
        }
      }
    })

    return {
      plugin,
      run,
      running,
      hasError,
      runInfoText,
      ortSession,
      hasData,
      output,
      loadLocalImage,
      loadingData,
      loadExample,
      download,
    }
  },
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
    },
    showViewer() {
      return !isPluginMode()
    }
  },
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
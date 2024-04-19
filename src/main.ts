import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import { isPluginMode, removeNpArrProxy } from './utils'
import { useRunStore } from './stores/run'

window.app = {}
window.app.router = router


async function setupImJoyCore() {
  loadImJoyCore().then((imjoyCore: any) => {
    const core = new imjoyCore.ImJoy({
      imjoy_api: {},
    })
    core.start({workspace: 'default'}).then(() => {
      console.log('ImJoy Core started successfully!')
      window.app.imjoy_api = core.api
    })
  })
}

async function createApi() {
  async function setup() {
    console.log("U-FISH is ready.")
  }

  async function waitRunable() {
    const runStore = useRunStore()
    await runStore.waitRunable()
  }

  async function run() {
    const runStore = useRunStore()
    await runStore.run()
  }

  async function setInputImage(inputImage: object, inputName: string) {
    const runStore = useRunStore()
    runStore.setInputImage(inputImage, inputName)
  }

  async function getOutput() {
    const runStore = useRunStore()
    const out = await runStore.getOutput()
    const res = {
      enhanced: removeNpArrProxy(out?.enhanced),
      spots: removeNpArrProxy(out?.spots),
    }
    return res
  }

  async function predict(inputImage: object) {
    await waitRunable()
    await setInputImage(inputImage, "input")
    await run()
    return await getOutput()
  }

  async function fetchImage(url: string) {
    await waitRunable()
    const runStore = useRunStore()
    runStore.setImageUrl(url)
    const arr = await runStore.getFetchedImage()
    const res = removeNpArrProxy(arr)
    return res
  }

  async function getInputImage() {
    await waitRunable()
    return await window.app.ufish_py.get_input_image()
  }

  return {
    "run": async () => {await waitRunable()},
    "setup": setup,
    "waitReady": waitRunable,
    "runPredict": run,
    "setInputImage": setInputImage,
    "getOutput": getOutput,
    "predict": predict,
    "fetchImage": fetchImage,
    "getInputImage": getInputImage,
  }
}

async function initImJoy() {
  // start as an plugin
  if (isPluginMode()) {
    const imjoyRPC = await loadImJoyRPC();
    const imjoy_api = await imjoyRPC.setupRPC({name: "ufish-web"});
    window.app.imjoy_api = imjoy_api;
    const ufish = await createApi();
    window.app.ufish = ufish;
    router.push("/predict")
    await imjoy_api.export(ufish)
  } else {
    // start as an standalone app
    await setupImJoyCore();
  }
}

initImJoy();

const vueApp = createApp(App)

vueApp.use(createPinia())
vueApp.use(router)

const vuetify = createVuetify({
  components,
  directives,
})
vueApp.use(vuetify)

vueApp.mount('#vue-app')


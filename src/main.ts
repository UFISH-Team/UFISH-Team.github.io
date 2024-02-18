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
import { isPluginMode } from './utils'
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

  async function run() {
    const runStore = useRunStore()
    await runStore.run()
  }

  return {
    "run": async () => {},
    "setup": setup,
    "runPredict": run,
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


import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as imJoyCore from 'imjoy-core'
import { useImJoyStore } from './stores/imjoy'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const imjoy = new imJoyCore.ImJoy({
  imjoy_api: {}
})

imjoy.start({workspace: 'default'}).then(async ()=>{
    console.log('ImJoy started');
    const imjoyStore = useImJoyStore()
    imjoyStore.setInstance(imjoy)
})

imjoy.event_bus.on("add_window", (w: any) => {
      const container = document.createElement('div');
      container.id = w.window_id; // <--- this is important
      container.style.backgroundColor = '#ececec';
      container.style.height = "300px";
      container.style.width = "100%";
      // Here we simply add to the body
      // but in reality, you can embed it into your UI
      document.body.appendChild(container)
})


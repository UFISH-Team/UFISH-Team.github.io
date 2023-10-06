<script lang="ts">
import { useImJoyStore } from '@/stores/imjoy';

export default {
  methods: {
    async loadImJoy() {
      const { imjoy } = useImJoyStore()
      if (imjoy !== null) {
        imjoy.api.log("Hello from Imjoy!")
        const viewer = await imjoy.api.createWindow({src: "https://kaibu.org/#/app", name: "Kaibu"})
        await viewer.add_image("https://raw.githubusercontent.com/imjoy-team/kaibu/master/public/static/img/kaibu-logo.gif?sanitize=true")
      } 
    }
  }
}

</script>

<template>
  <div>Hello</div>
  <div>
    <button @click="loadImJoy">Load ImJoy</button>
  </div>
</template>

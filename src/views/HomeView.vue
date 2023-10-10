<template>
  <div class="container">
    <div class="info-text">
      U-FISH is a deep learning method for FISH spot ✨ detection.
    </div>
    <div class="info-text-2">
    </div>
    <div class="card-container">
      <InfoCard
        img="/images/dataset2.jpg"
        title="Dataset"
        subtitle="U-FISH dataset for train and test" />
      <InfoCard
        img="/images/run_in_browser2.jpg"
        title="Predict"
        subtitle="Run U-FISH model in brwoser" />
    </div>
  </div>
</template>

<script lang="ts">
import { useImJoyStore } from '@/stores/imjoy';
import InfoCard from '../components/InfoCard.vue';

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
  },
  components: {
    InfoCard
  },
}
</script>

<style scoped>
.info-text {
  font-size: 1.5em;
  text-align: center;
  margin: 2em;
}
.card-container {
  justify-content: center;
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
  margin: 5em;
  margin-top: 2em;
}
</style>

<template>
  <div class="container">
    <div class="info-text">
      U-FISH is a deep learning method for FISH spot ✨ detection.
    </div>
    <div style="font-family:Arial, Helvetica, sans-serif">
      See our pre-print at <a href="https://www.biorxiv.org/content/10.1101/2024.03.06.583706v1">bioRxiv</a>!
    </div>
    <div class="card-container">
      <InfoCard
        img="/images/dataset2.jpg"
        title="Dataset"
        subtitle="U-FISH dataset for train and test"
        :click-action="()=>{gotoPage('dataset')}" />
      <InfoCard
        img="/images/run_in_browser2.jpg"
        title="Predict"
        subtitle="Run U-FISH model in brwoser"
        :click-action="()=>{gotoPage('predict')}" />
      <InfoCard
        img="/images/chatbot.webp"
        title="Chatbot"
        subtitle="Use U-FISH with Bioimage.IO Chatbot"
        :click-action="()=>{gotoPage('chatbot')}" />
    </div>
    <div class="info-text">
      Try it now! 🔥
    </div>
  </div>
</template>

<script lang="ts">
import InfoCard from '../components/InfoCard.vue';

export default {
  methods: {
    gotoPage(page: string) {
      this.$router.push({ name: page })
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
  margin: 1em;
  margin-top: 0;
}
.card-container {
  justify-content: center;
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
  margin: 5em;
  margin-top: 1em;
  margin-bottom: 3em;
}
</style>

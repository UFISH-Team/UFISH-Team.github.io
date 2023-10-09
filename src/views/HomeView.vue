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
  <v-container>
    <v-row align="center" justify="center">
      <v-col>
        <v-card
          max-width="400">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            height="200px"
            cover
          ></v-img>
          <v-card-title> Top western road trips </v-card-title>

          <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>

          <v-card-actions>
            <v-btn color="orange-lighten-2" variant="text"> Explore </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          max-width="400"
          >
          <v-card-item>
            <div>
              <div class="text-overline mb-1">HHHH</div>
              <div class="text-h6 mb-1">Headline</div>
              <div class="text-caption">hhhhh</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

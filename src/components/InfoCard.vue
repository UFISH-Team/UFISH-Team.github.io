<template>
    <v-card width="400">
      <v-img
        :src="img"
        height="320px"
        cover
      ></v-img>
      <v-card-title> {{ title }} </v-card-title>

      <v-card-subtitle> {{ subtitle }} </v-card-subtitle>

      <v-card-actions>
        <v-btn color="blue" variant="text"> Explore </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script lang="ts">
export default {
  props: {
    img: String,
    title: String,
    subtitle: String
  }
}
</script>
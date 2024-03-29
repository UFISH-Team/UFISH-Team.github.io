<template>
  <h1>U-FISH Dataset</h1>
  <div>
    Number of images: {{ csvData?.length }},
    spots: {{ csvData?.reduce((acc, cur) => acc + parseInt(cur.num_spots), 0) }}
  </div>
  <v-card id="viewer-container">
    <v-card id="umap-card" :style="{ width: cardWidth }">
      <div id="umap-container"></div>

      <v-overlay
        v-model="umapOverlay"
        contained
        class="align-center justify-center"
      >
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-overlay>
    </v-card>
    <v-card id="kaibu-card" v-if="showViewer">
      <div id="kaibu-container"></div>
      <v-overlay
        v-model="kaibuOverlay"
        contained
        class="align-center justify-center"
      >
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-card>
  <div class="text-panel">
    All data can be downloaded from <a href="https://huggingface.co/datasets/GangCaoLab/FISH_spots">this HuggingFace🤗 repo</a>!
  </div>
</template>

<script lang="ts">
import * as csv from "jquery-csv"
import * as Plotly from "plotly.js-dist"
import { getImjoyApi, isPluginMode } from '@/utils';

interface UMAPData {
  x: number
  y: number
  source: string
  image_name: string
  simulated: string
  num_spots: string
}

export default {
  data: () => ({
    umapCSVUrl: window.location.origin + "/data/dataset_umap.csv",
    csvData: null as Array<UMAPData> | null,
    viewer: null as any,
    imgBaseURL: "https://huggingface.co/datasets/GangCaoLab/FISH_spots/resolve/main/2d/image/",
    csvBaseURL: "https://huggingface.co/datasets/GangCaoLab/FISH_spots/resolve/main/2d/csv/",
    showViewer: !isPluginMode(),
  }),

  computed: {
    kaibuOverlay() {
      return this.viewer === null
    },
    umapOverlay() {
      return this.csvData === null
    },
    cardWidth() {
      return this.showViewer ? "50%" : "100%"
    }
  },

  mounted() {
    this.loadUMAPCSV()
    this.loadViewer()
  },

  methods: {
    async loadUMAPCSV() {
      const csvUrl = this.umapCSVUrl
      const resp = await fetch(csvUrl)
      const data = await resp.text()
      this.csvData = csv.toObjects(data)
    },

    async loadViewer() {
      const imjoy_api = await getImjoyApi()
      const pluginUrl = window.location.origin + "/plugins/viewer.imjoy.html"
      const viewer = await imjoy_api.loadPlugin({ src: pluginUrl })
      this.viewer = viewer
    },

    async onClickPoint(data: any) {
      if (this.viewer === null) {
        return
      } else {
        const point = data.points[0];
        const imgName = point.text.split("<br>")[0].split(":</b> ")[1]
        console.log(`You clicked on point: ${imgName} at position (x: ${point.x}, y: ${point.y})`)
        const imgURL = this.imgBaseURL + imgName
        const imgBytes = await fetch(imgURL).then(resp => resp.arrayBuffer())
        await this.viewer.view_img_from_bytes(imgName, imgBytes)
        const csvName = imgName.replace(".tif", ".csv")
        const csvURL = this.csvBaseURL + csvName
        const csvContent = await fetch(csvURL).then(resp => resp.text())
        const csvData = csv.toObjects(csvContent)
        const points = csvData.map((d: any) => [d['axis-1'], d['axis-0']])
        await this.viewer.add_points(points, csvName)
      }
    },

    async renderUMAP() {
      const data = this.csvData!
      const traces = {} as any
      data.forEach(point => {
        const label = point.source
        if (!traces[label]) {
          traces[label] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scattergl',
            name: label,
            text: [],
            marker: { size: 3 }
          };
        }
        traces[label].x.push(point.x);
        traces[label].y.push(point.y);
        traces[label].text.push(
          `<b>Image Name:</b> ${point.image_name}<br>` +
          `<b>Simulated:</b> ${point.simulated}<br>` +
          `<b>Number of Spots:</b> ${point.num_spots}<br>` +
          `<b>Label:</b> ${point.source}<br>`
        );
      });

      const layout = {
        xaxis: {
          title: 'UMAP 1'
        },
        yaxis: {
          title: 'UMAP 2'
        }
      };

      const config = {
        responsive: true
      }

      const umapContainer = document.getElementById("umap-container")!
      Plotly.newPlot(umapContainer, Object.values(traces), layout, config);

      const umapPlot = document.getElementById('umap-container') as any;
      
      umapPlot.on('plotly_click', this.onClickPoint)
    }
  },

  watch: {
    csvData(newVal) {
      if (newVal !== null) {
        this.renderUMAP()
      }
    },

  }
}
</script>

<style scoped>
#umap-card {
  min-width: 400px;
}
#umap-container {
  height: 600px;
}
#kaibu-card {
  width: 50%;
  min-width: 400px;
}
#kaibu-container {
  width: 100%;
  height: 600px;
  overflow: auto;
  resize: both;
}
#viewer-container {
  width: 90%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.text-panel {
  margin-top: 20px;
  font-size: 1.5em;
}
</style>
<template>
  <h1>U-FISH Dataset</h1>
  <div>
    Number of images: {{ csvData?.length }},
    spots: {{ csvData?.reduce((acc, cur) => acc + parseInt(cur.num_spots), 0) }}
  </div>
  <div id="umap-container"></div>
  <div id="viewer-container">
    <div id="kaibu-container"></div>
  </div>
  <div class="text-panel">
    All data can be downloaded from <a href="https://huggingface.co/datasets/GangCaoLab/FISH_spots">this HuggingFace🤗 repo</a>!
  </div>
</template>

<script lang="ts">
import * as csv from "jquery-csv"
import * as Plotly from "plotly.js-dist"

declare var imjoy: any;

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
  }),

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
      if (imjoy !== null) {
        const viewer = await imjoy.api.createWindow(
          { src: "https://kaibu.org/#/app", window_id: "kaibu-container" })
        this.viewer = viewer
        await viewer.set_mode("full")
      } else {
        setTimeout(() => this.loadViewer(), 1000)
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
      
      umapPlot.on('plotly_click', function(data: any){
        const point = data.points[0];
        alert(`You clicked on point at position (x: ${point.x}, y: ${point.y})`);
      })
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
#umap-container {
  width: 70%;
  min-width: 600px;
  height: 800px;
}
#kaibu-container {
  width: 90%;
  height: 600px;
}
#viewer-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.text-panel {
  margin-top: 20px;
  font-size: 1.5em;
}
</style>
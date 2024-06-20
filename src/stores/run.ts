import { defineStore } from "pinia";
import { computed } from "vue";

export async function waitState(stateFn: () => any, value: any) {
  const stateValue = computed(stateFn); // replace with your state

  while (stateValue.value !== value) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // polling interval
  }

  console.log("State changed to the specific value");
}

export async function waitRunable() {
  const store = useRunStore();
  await waitState(() => store.runable, true);
}

export async function waitOutputGetable() {
  const store = useRunStore();
  await waitState(() => store.outputGetable, true);
}

export async function waitFetchGetable() {
  const store = useRunStore();
  await waitState(() => store.fetchGetable, true);
}

type ApiInput = {
  data: object,
  name: string,
}

type ApiOutput = {
  enhanced: object,
  spots: object,
}

export const useRunStore = defineStore("run", {
  state: () => ({
    runQueryCount: 0,
    runable: false,
    inputImage: null as ApiInput | null,
    output: null as ApiOutput | null,
    outputGetable: false,
    imageUrl: null as string | null,
    fetchedImage: null as object | null,
    fetchGetable: false,
    channel: null as (number | null),
    pThreshold: 0.5,
    viewEnhanced: true,
    headless: false,
    exampleImageUrl: "https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif",
    onnxModelUrl: "http://localhost:5173/model/v1.0-alldata-ufish_c32.onnx",
  }),
  actions: {
    async waitRunable() {
      await waitRunable();
    },
    async run() {
      await waitRunable();
      this.runQueryCount += 1;
      await waitRunable();
      this.outputGetable = false;
    },
    setRunable(runable: boolean) {
      this.runable = runable;
    },
    setInputImage(data: object, name: string) {
      this.inputImage = { data, name }
    },
    clearInputImage() {
      this.inputImage = null;
    },
    setOutput(output: ApiOutput) {
      this.output = output;
      this.outputGetable = true;
    },
    async getOutput() {
      await waitOutputGetable();
      return this.output;
    },
    setImageUrl(url: string | null) {
      this.imageUrl = url;
      if (url !== null) {
        this.fetchGetable = false;
      }
    },
    setFetchedImage(image: object | null) {
      this.fetchedImage = image;
      this.fetchGetable = true;
    },
    async getFetchedImage() {
      await waitFetchGetable();
      return this.fetchedImage;
    },
    setParams(channel: number | null, pThreshold: number, headless: boolean, viewEnhanced: boolean) {
      this.channel = channel;
      this.pThreshold = pThreshold;
      this.headless = headless;
      this.viewEnhanced = viewEnhanced;
    },
    setExampleImageUrl(url: string) {
      this.exampleImageUrl = url;
    },
    setOnnxModelUrl(url: string) {
      this.onnxModelUrl = url;
    }
  }
}) 
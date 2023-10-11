import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useImJoyStore = defineStore('imjoy', () => {
  const imjoy: Ref<any> = ref(null)
  const setInstance = (ins: any) => {
    imjoy.value = ins
  }

  return { imjoy, setInstance }
})

export const useKaibuViewer = defineStore('kaibu-viewer', () => {
  const viewer: Ref<any> = ref(null)
  const setViewer = (ins: any) => {
    viewer.value = ins
  }

  return { viewer, setViewer }
})

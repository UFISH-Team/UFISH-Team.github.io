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

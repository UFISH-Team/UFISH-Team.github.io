export async function getImjoyApi() {
  // load imjoy from window.app.imjoy
  // if not exist, wait for it
  while (!window.app || !window.app.imjoy_api) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(window.app)
  }
  return window.app.imjoy_api
}

export function isPluginMode() {
  return window.self !== window.top
}

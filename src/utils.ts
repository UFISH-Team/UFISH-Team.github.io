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

export function downloadBlob(
    content: any, filename: string, contentType: string
  ) {
  // Create a blob
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}


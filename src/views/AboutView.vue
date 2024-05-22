<template>
  <div class="about">
    <h1>About U-FISH</h1>
    <img id="logo" src="https://avatars.githubusercontent.com/u/144716463?s=400&u=ee7ecd44d0be44fff2ebec00ad301e9229ce4e3a&v=4" />
    <div>
      <p>
        U-FISH is an advanced FISH spot calling algorithm based on deep learning.
      </p>
      <p>
        The "U" in U-FISH represents both the U-Net architecture and the Unified output of enhanced images.
      </p>
      <p>
        See our github repos for more details:
        <a href="https://github.com/UFISH-Team">U-FISH Team.</a>
      </p>
    </div>
    <h2>Web app</h2>
    <div>
      <p>
        This web application is built with:
        Vue, onnxruntime-web,
        <a href="https://imjoy.io/#/">ImJoy</a>
        and <a href="https://kaibu.org/docs/#/">Kaibu</a>.
      </p>
      <p>
        The source code is available at <a href="https://github.com/UFISH-Team/UFISH-Team.github.io">here</a>.
      </p>
    </div>
    <img src="https://github.com/UFISH-Team/U-FISH/blob/main/docs/ufish.png?raw=true" />
  </div>
</template>

<style>
.about {
  text-align: center;
  width: 80%;
}
img {
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
}
#logo {
  max-width: 200px;
}
.left-align-item {
  align-self: start;
  justify-content: start;
  text-align: left;
}
</style>

# ufish-web

The web interface for the U-FISH project.

Online instance: [ufish-web](https://ufish-team.github.io/#/)


## ImJoy API

Usage example:

```Python
ufish = await api.createWindow("https://ufish-team.github.io/")
img = np.random.rand(100, 100)  # generate a random image
out = await ufish.predict(img)  # predict the spots
print(out.enhanced.shape)
print(out.spots.shape)
```

## Development

```sh
npm install
```

Compile and Hot-Reload for Development

```sh
npm run dev
```

Type-Check, Compile and Minify for Production

```sh
npm run build
```

Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

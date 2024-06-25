# ufish-web

The web interface for the U-FISH project.

Online instance: [ufish-web](https://ufish-team.github.io/#/)


## ImJoy API

Usage example:

```Python
ufish = await api.createWindow("https://ufish-team.github.io/")
img = await ufish.fetchImage("https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif")
out = await ufish.predict(img)  # predict the spots
print(out.enhanced.shape)
print(out.spots.shape)
```

CLick to run it using: [web-python-console](https://nanguage.github.io/web-python-console/?file=https://ufish-team.github.io/scripts/demo.py)

### Full API List

| Method | Parameters | Description |
| --- | --- | --- |
| `predict` | `img: np.ndarray` | Predict the spots in the input image. The input should be 2d image(x, y) or RGB image(x, y, 3) |
| `waitReady` | | Wait until the model is ready. |
| `setInputImage` | `img: np.ndarray; name: string` | Set the input image. |
| `getOutput` | | Get the output of the model. It's an object contain `enhanced: np.ndarray` and `spots: np.ndarray` fields |
| `runPredict` | | Run the prediction. |
| `fetchImage` | `url: string` | Fetch an image from the given url, return a numpy array |

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

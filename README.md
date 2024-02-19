# ufish-web

The web interface for the U-FISH project.

Online instance: [ufish-web](https://ufish-team.github.io/#/)


## ImJoy API

Usage example:

```Python
import numpy as np
ufish = await api.createWindow("https://ufish-team.github.io/")
img = np.random.rand(100, 100)  # generate a random image
out = await ufish.predict(img)  # predict the spots
print(out.enhanced.shape)
print(out.spots.shape)
```

### Full API List

| Method | Parameters | Description |
| --- | --- | --- |
| `predict` | `img: np.ndarray` | Predict the spots in the input image. |
| `waitReady` | | Wait until the model is ready. |
| `setInputImage` | `img: np.ndarray; name: string` | Set the input image. |
| `getOutput` | | Get the output of the model. It's an object contain `enhanced: np.ndarray` and `spots: np.ndarray` fields |
| `runPredict` | | Run the prediction. |

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

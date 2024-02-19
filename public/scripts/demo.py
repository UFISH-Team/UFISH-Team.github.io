import numpy as np
ufish = await api.createWindow("https://ufish-team.github.io/")
img = np.random.rand(100, 100)  # generate a random image
out = await ufish.predict(img)  # predict the spots
print(out.enhanced.shape)
print(out.spots.shape)

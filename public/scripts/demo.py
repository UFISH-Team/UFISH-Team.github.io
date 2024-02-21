ufish = await api.createWindow("http://localhost:5173/")
img = await ufish.fetchImage("https://huggingface.co/datasets/NaNg/TestData/resolve/main/FISH_spots/MERFISH_1.tif")
out = await ufish.predict(img)  # predict the spots
print(out.enhanced.shape)
print(out.spots.shape)
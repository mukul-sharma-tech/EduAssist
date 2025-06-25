import numpy as np
import pandas as pd
df = pd.read_csv("confused.csv", nrows=5, low_memory=False)
print(df.columns)
print(df.head())
# Convert a single row to image
row = df.iloc[0].values.astype(np.uint8)
img = row.reshape((256, 256, 3))

import matplotlib.pyplot as plt

plt.imshow(img)
plt.axis('off')
plt.show()


import os
from PIL import Image

data_dir = '../Dataset/archive'

for root, dirs, files in os.walk(data_dir):
    for file in files:
        file_path = os.path.join(root, file)
        try:
            with Image.open(file_path) as img:
                img.verify()  # Verify that it is, in fact, an image
        except Exception as e:
            print(f"Removing corrupted or non-image file: {file_path}")
            os.remove(file_path)
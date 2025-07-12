from skimage.filters.rank import entropy
from skimage.morphology import disk
import cv2
import numpy as np
from openvino.runtime import Core
from PIL import Image
import os
import json

# Paths
model_xml = os.path.join("intel", "handwritten-english-recognition-0001", "FP32", "handwritten-english-recognition-0001.xml")
symbol_txt = os.path.join("intel", "handwritten-english-recognition-0001", "gnhk.txt")
image_path = "handwritten-english-recognition-0001.jpg"

# Load model
ie = Core()
model = ie.read_model(model=model_xml)
compiled_model = ie.compile_model(model=model, device_name="CPU")
output_layer = compiled_model.output(0)

# Load symbol map from official text file as a string (for CTC decoding)
with open(symbol_txt, "r", encoding="utf-8") as f:
    symbol_map = ''.join(line.rstrip("\n") for line in f)

def binarize(img):
    # calculate local entropy
    entr = entropy(img, disk(5))
    # Normalize and negate entropy values
    MAX_ENTROPY = 8.0
    MAX_PIX_VAL = 255
    negative = 1 - (entr / MAX_ENTROPY)
    u8img = (negative * MAX_PIX_VAL).astype(np.uint8)
    # Global thresholding
    _, mask = cv2.threshold(u8img, 0, MAX_PIX_VAL, cv2.THRESH_OTSU)
    # mask out text
    masked = cv2.bitwise_and(img, img, mask=mask)
    # fill in the holes to estimate the background
    kernel = np.ones((35, 35), np.uint8)
    background = cv2.dilate(masked, kernel, iterations=1)
    # By subtracting background from the original image, we get a clean text image
    text_only = cv2.absdiff(img, background)
    # Negate and increase contrast
    neg_text_only = (MAX_PIX_VAL - text_only) * 1.15
    # clamp the image within u8 range
    _, clamped = cv2.threshold(neg_text_only, 255, MAX_PIX_VAL, cv2.THRESH_TRUNC)
    clamped_u8 = clamped.astype(np.uint8)
    # Do final adaptive thresholding to binarize image
    processed = cv2.adaptiveThreshold(clamped_u8, MAX_PIX_VAL, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)
    return processed

def preprocess_image(img):
    # Convert to grayscale if not already
    if len(img.shape) == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Resize to height 96, keep aspect ratio
    h = 96
    ratio = img.shape[1] / img.shape[0]
    w = int(h * ratio)
    img = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32)
    # Add channel dimension [1, h, w]
    img = img[None, :, :]
    # Pad both height and width to [1, 96, 2000] using edge values
    pad_img = np.pad(img, ((0, 0), (0, h - img.shape[1]), (0, 2000 - img.shape[2])), mode='edge')
    # Save preprocessed image for inspection
    vis_img = pad_img[0, :, :].astype(np.uint8)
    cv2.imwrite("preprocessed.png", vis_img)
    # Add batch dimension [1, 1, 96, 2000]
    pad_img = np.expand_dims(pad_img, axis=0)
    return pad_img

# Improved CTC greedy decoder matching demo logic
# CTC blank is index 0, so symbol_map[1:] matches output indices 1+
def ctc_greedy_decoder(output):
    output = np.squeeze(output)
    pred_indices = np.argmax(output, axis=1)
    decoded = []
    prev = None
    for idx in pred_indices:
        if idx != prev and idx != 0:
            # CTC blank is 0, so symbol_map[idx-1] for idx > 0
            decoded.append(symbol_map[idx-1])
        prev = idx
    return ''.join(decoded)

if __name__ == "__main__":
    if not os.path.exists(image_path):
        print(f"Image file {image_path} not found.")
        exit(1)
    pil_img = Image.open(image_path)
    img = np.array(pil_img)
    img = preprocess_image(img)
    result = compiled_model([img])[output_layer]
    text = ctc_greedy_decoder(result)
    print(f"Recognized text: {text}")

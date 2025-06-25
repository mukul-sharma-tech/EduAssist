import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

# Set your dataset path
# The directory should have subfolders for each emotion: angry, sad, neutral, shy, etc.
data_dir = '../Dataset/archive/fane_data'  # <-- Updated path
img_size = (48, 48)
batch_size = 32

# Data generators with augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)
train_gen = train_datagen.flow_from_directory(
    data_dir,
    target_size=img_size,
    color_mode='grayscale',
    batch_size=batch_size,
    class_mode='binary',  # <-- Change to binary
    subset='training',
    shuffle=True
)
val_gen = train_datagen.flow_from_directory(
    data_dir,
    target_size=img_size,
    color_mode='grayscale',
    batch_size=batch_size,
    class_mode='binary',  # <-- Change to binary
    subset='validation',
    shuffle=True
)

# Compute class weights to handle imbalance
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_gen.classes),
    y=train_gen.classes
)
class_weights = dict(enumerate(class_weights))

# Model
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(48,48,1)),
    MaxPooling2D(2,2),
    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(2,2),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')  # <-- Change to 1 output with sigmoid
])
model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])

# Train with class weights
model.fit(train_gen, validation_data=val_gen, epochs=50, class_weight=class_weights)
model.save('emotion_model.h5')

print('Model trained and saved as emotion_model.h5')

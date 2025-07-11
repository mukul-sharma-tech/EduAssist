import numpy as np
from keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import confusion_matrix, classification_report

# Set your validation data path and parameters
val_data_dir = '../Dataset/archive/fane_data'  # Update if needed
img_size = (48, 48)
batch_size = 32

# Data generator for validation set
val_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
val_gen = val_datagen.flow_from_directory(
    val_data_dir,
    target_size=img_size,
    color_mode='grayscale',
    batch_size=batch_size,
    class_mode='binary',
    subset='validation',
    shuffle=False
)

# Load your trained model
model = load_model('emotion_model.h5')

# Get ground truth and predictions
val_gen.reset()
y_true = val_gen.classes
preds = model.predict(val_gen, verbose=1)
y_pred = (preds > 0.5).astype(int).reshape(-1)

print('Confusion Matrix:')
print(confusion_matrix(y_true, y_pred))
print('Classification Report:')
print(classification_report(y_true, y_pred, target_names=['not_confused', 'confused']))

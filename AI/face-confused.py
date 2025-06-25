from keras.models import load_model
model = load_model('Emotion_Detection.h5')
print(model.input_shape)
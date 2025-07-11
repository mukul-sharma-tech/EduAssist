import cv2
import numpy as np
from keras.models import load_model
from keras.preprocessing.image import img_to_array

# Load face detector and binary confusion model
face_cascade = cv2.CascadeClassifier('./face.xml')
model = load_model('./emotion_model.h5')

# Initialize webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        gray_face = gray[y:y + h, x:x + w]
        gray_face = cv2.resize(gray_face, (48, 48), interpolation=cv2.INTER_AREA)

        if np.sum([gray_face]) != 0:
            face = gray_face.astype('float') / 255.0
            face = img_to_array(face)
            face = np.expand_dims(face, axis=0)

            prediction = model.predict(face)[0][0]
            label = 'confused' if prediction > 0.5 else 'not_confused'
            color = (0, 0, 255) if label == 'confused' else (0, 255, 0)
            cv2.putText(frame, label, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)
        else:
            cv2.putText(frame, 'Face not found', (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
    cv2.imshow('Confusion Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

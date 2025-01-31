import os
from deepface import DeepFace

# Define the base directory
base_dir = '/Users/nabinupreti/Desktop/AMS_1/Attendance-Management-System/'

# Construct the full paths to the images
img1_path = os.path.join(base_dir, 'images', 'img2.jpeg')
img2_path = os.path.join(base_dir, 'images', 'user_34.jpeg')

# Perform the verification
#verification = DeepFace.verify(img1_path=img1_path, img2_path=img2_path)

verification = DeepFace.verify(
    img1_path=img1_path, 
    img2_path=img2_path,
    model_name="ArcFace",  # More robust model
    detector_backend="retinaface",  # Best for face alignment
    distance_metric="euclidean_l2",  # Stricter distance measure
    enforce_detection=True,  # Avoid using blank images if no face is detected
    align=True  # Corrects face alignment issues
)


# Custom strict threshold (reduce false positives)
distance = verification["distance"]
threshold = 1  # Adjust threshold to a stricter value

if distance < threshold:
    verification["verified"] = True
else:
    verification["verified"] = False

print(verification)
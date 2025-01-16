import os
from deepface import DeepFace

# Define the base directory
base_dir = '/Users/nabinupreti/Desktop/AMS/'

# Construct the full paths to the images
img1_path = os.path.join(base_dir, 'images', 'img1.jpg')
img2_path = os.path.join(base_dir, 'images', 'img2.jpg')

# Perform the verification
verification = DeepFace.verify(img1_path=img1_path, img2_path=img2_path)
print(verification)
import base64
import os

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return encoded_string

# Replace 'path/to/your/image.jpg' with the actual path to your image file
base_dir = '/Users/nabinupreti/Desktop/AMS/'
image_path = os.path.join(base_dir, 'images', 'img1.jpg')
encoded_image = encode_image_to_base64(image_path)
print(encoded_image)
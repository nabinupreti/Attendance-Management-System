import os
import json
from deepface import DeepFace

class FaceVerification:
    def __init__(self, base_dir):
        """
        Initializes the FaceVerification class with the base directory of stored images.
        
        :param base_dir: Path to the directory where student images are stored.
        """
        self.base_dir = base_dir
    
    def verify_identity(self, user_id, input_image_path):
        """
        Compares the stored student image with an input image and returns a JSON response.
        
        :param user_id: ID of the student (used to fetch the stored image).
        :param input_image_path: Path to the image provided for comparison.
        :return: JSON response indicating whether the images match.
        """
        stored_image_path = os.path.join(self.base_dir, f"user_{user_id}.jpeg")
        print("Stored Image Path:", stored_image_path)  # Debugging

        if not os.path.exists(stored_image_path):
            return json.dumps({"error": "Stored student image not found"}, indent=4)
        
        if not os.path.exists(input_image_path):
            return json.dumps({"error": "Input image not found"}, indent=4)

        try:
            verification = DeepFace.verify(img1_path=stored_image_path, img2_path=input_image_path)
            return json.dumps({
                "verified": verification["verified"],
                "distance": verification["distance"],
                "threshold": verification["threshold"],
                "message": "Match" if verification["verified"] else "No match"
            }, indent=4)
        except Exception as e:
            return json.dumps({"error": str(e)}, indent=4)

# Correct base directory and input image path
face_verifier = FaceVerification(r"/Users/nabinupreti/Desktop/AMS_1/Attendance-Management-System/backend/student_images")
result = face_verifier.verify_identity(34, "/Users/nabinupreti/Desktop/AMS_1/Attendance-Management-System/backend/student_images/user_34.jpeg")
print(result)

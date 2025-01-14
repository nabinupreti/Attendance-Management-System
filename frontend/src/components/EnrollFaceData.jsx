import React, { useRef } from 'react';

function EnrollFaceData() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    submitPhoto(imageData);
  };

  const submitPhoto = (imageData) => {
    // Submit the photo to the AI model
    console.log("Submitting photo to AI model: ", imageData);
    // Add your API call here
  };

  return (
    <div className="enroll-face-data">
      <h1>Enroll Face Data</h1>
      <div className="webcam-container">
        <video ref={videoRef} width="640" height="480" />
        <button onClick={startWebcam}>Start Webcam</button>
      </div>
      <div className="photo-container">
        <canvas ref={canvasRef} width="640" height="480" />
        <button onClick={takePhoto}>Take Photo</button>
      </div>
    </div>
  );
}

export default EnrollFaceData;
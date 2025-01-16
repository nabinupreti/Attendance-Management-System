import React, { useState, useRef, useEffect } from 'react';

function TakeAttendance() {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    // Cleanup the webcam stream on component unmount
    return () => {
      if (webcamRef.current) {
        const stream = webcamRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamRef.current.srcObject = stream;
      setIsWebcamActive(true);
      setIsButtonDisabled(true);
    } catch (error) {
      console.error('Error accessing webcam: ', error);
    }
  };

  return (
    <div className="take-attendance">
      <h1>Take Attendance</h1>

      <div className="webcam-frame">
        {/* Webcam feed or placeholder */}
        {isWebcamActive ? (
          <video
            ref={webcamRef}
            autoPlay
            muted
            width="400"
            height="300"
            style={{ border: '1px solid #ddd' }}
          />
        ) : (
          <p>Webcam feed will be displayed here</p>
        )}
      </div>

      <button
        className="take-attendance-button"
        onClick={startWebcam}
        disabled={isButtonDisabled}
      >
        Take Attendance
      </button>
    </div>
  );
}

export default TakeAttendance;

/*
---TODO---
PAILA EUTA CAMERA DEKHAUNA PARYO KHOLE CHALNE HUNA PARY0
PHOTO KHICHAUNE
PHOTO SEND BACKEND
*/
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, set, push } from "firebase/database";
import NavBar from '../components/NavBar';
import { storage } from '../firebase'; // Import Firebase Storage
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import './webPages.css';

function CameraPage() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mood, setMood] = useState(''); // State for mood selection
  const [note, setNote] = useState(''); // State for user note

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // Load face detection model
      await faceapi.nets.faceExpressionNet.loadFromUri('/models'); // Load emotion detection model
    };
    loadModels();
  }, []);

  // Capture a screenshot from the webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Save the captured image
  }, [webcamRef]);

  // Upload the captured image, mood, and note to Firebase
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!image || !user) {
      alert("No image captured or user not logged in.");
      return;
    }

    setUploading(true);

    try {
      const db = getDatabase();
      const userImagesRef = dbRef(db, `users/${user.uid}/images`);
      const newImageRef = push(userImagesRef);
      const timestamp = new Date().toISOString();

      await set(newImageRef, {
        imageData: image, // Base64-encoded image data
        timestamp: timestamp,
        mood: mood || "Not specified", // Save the selected mood
        note: note || "No note provided", // Save the user's note
      });

      alert("Upload successful!");
      setImage(null);
      setMood('');
      setNote('');
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <div className="webstream">
        {image === null ? (
          <>
            <Webcam
              ref={webcamRef}
              className="webcam"
              audio={false}
              screenshotFormat="image/jpeg"
            />
            <button className="submit" onClick={capture}>Capture</button>
          </>
        ) : (
          <>
            <img className="webcam" src={image} alt="screenshot" />
            <div className="groupButtons">
              <button className="submit" onClick={() => setImage(null)}>Retake</button>
            </div>
            {/* Mood Selection Dropdown */}
            <div className="mood-selection">
              <label htmlFor="mood">Select your mood:</label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="mood-dropdown"
              >
                <option value="">--Choose Mood--</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Neutral">Neutral</option>
                <option value="Excited">Excited</option>
                <option value="Angry">Angry</option>
              </select>
            </div>
            {/* Note Text Field */}
            <div className="note-section">
              <label htmlFor="note">Write about this moment:</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened? How do you feel?"
                className="note-input"
              />
            </div>
            <form onSubmit={handleUpload} className="form">
              <button className="submit" type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CameraPage;
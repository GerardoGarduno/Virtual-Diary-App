import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { storage } from '../firebase'; // Import Firebase Storage
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, push } from "firebase/database"; // Import Realtime Database
import NavBar from '../components/NavBar';
import './webPages.css';

function CameraPage() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // const handleUpload = async (event) => {
  //   event.preventDefault();
  //   if (!image || !user) {
  //     alert("No image captured or user not logged in.");
  //     return;
  //   }

  //   setUploading(true);

  //   try {
  //     // Generate a unique filename for the image
  //     const timestamp = new Date().toISOString();
  //     const filePath = `users/${user.uid}/images/${timestamp}.jpg`;

  //     // Upload the image to Firebase Storage
  //     const storageRef = ref(storage, filePath);
  //     await uploadString(storageRef, image, 'data_url');

  //     // Get the public URL of the uploaded image
  //     const imageUrl = await getDownloadURL(storageRef);

  //     // Save the image URL to Firebase Realtime Database
  //     const db = getDatabase(); // Initialize Realtime Database
  //     const userImagesRef = dbRef(db, `users/${user.uid}/images`);
  //     const newImageRef = push(userImagesRef); // Create a unique key for the image
  //     await set(newImageRef, {
  //       imageUrl,
  //       timestamp: timestamp,
  //     });

  //     alert("Upload successful!");
  //   } catch (error) {
  //     console.error("Error uploading image: ", error);
  //     alert("Upload failed. Please try again.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!image || !user) {
      alert("No image captured or user not logged in.");
      return;
    }
  
    setUploading(true);
  
    try {
      // Save the base64 image directly to Firebase Realtime Database
      const db = getDatabase(); // Initialize Realtime Database
      const userImagesRef = dbRef(db, `users/${user.uid}/images`);
      const newImageRef = push(userImagesRef); // Create a unique key for the image
      const timestamp = new Date().toISOString();
  
      await set(newImageRef, {
        imageData: image, // Base64-encoded image data
        timestamp: timestamp,
      });
  
      alert("Upload successful!");
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

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
          </>
        )}
      </div>
      <form onSubmit={handleUpload} className="form">
        <button className="submit" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default CameraPage;
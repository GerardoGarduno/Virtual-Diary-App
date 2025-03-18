import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, onValue, remove } from "firebase/database";
import NavBar from '../components/NavBar';
import './webPages.css';

function WalletPage() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const auth = getAuth();
  const getMoodClass = (mood) => {
    switch (mood?.toLowerCase()) {
      case "happy":
        return "mood-happy";
      case "sad":
        return "mood-sad";
      case "neutral":
        return "mood-neutral";
      case "excited":
        return "mood-excited";
      case "angry":
        return "mood-angry";
      default:
        return "mood-default"; // Default class if mood is undefined or unrecognized
    }
  };
  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        // Fetch images from Firebase Realtime Database
        const db = getDatabase();
        const userImagesRef = dbRef(db, `users/${user.uid}/images`);
        onValue(userImagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert the object into an array of images with keys
            const imagesArray = Object.entries(data).map(([key, value]) => ({
              id: key, // Include the unique key for deletion
              ...value,
            }));
            setImages(imagesArray);
          } else {
            setImages([]); // No images found
          }
        });
      } else {
        setUser(null);
        setImages([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleDelete = async (imageId) => {
      if (!user) return;
    
      // Show a confirmation dialog
      const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
      if (!confirmDelete) {
        return; // Exit if the user cancels
      }
    
      try {
        const db = getDatabase();
        const imageRef = dbRef(db, `users/${user.uid}/images/${imageId}`);
        await remove(imageRef); // Remove the image from the database
        alert("Image deleted successfully!");
    
        // Update the UI by filtering out the deleted image
        setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete the image. Please try again.");
    }
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <div className="walletPage">
        <h1>Your Uploaded Images</h1>
        <div className="imageGrid">
          {images.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className={`imageCard ${getMoodClass(image.mood)}`}>
              
                <img src={image.imageData} alt="Uploaded" className="uploadedImage" />
                <p><strong>Uploaded:</strong> {new Date(image.timestamp).toLocaleString()}</p>
                {image.mood && <p><strong>Mood:</strong> {image.mood}</p>}
                {image.note && <p><strong>Note:</strong> {image.note}</p>}
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(image.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No images found. Start uploading!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
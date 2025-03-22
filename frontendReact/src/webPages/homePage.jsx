import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../components/NavBar';
import './webPages.css';
import logo from '../assets/logo.png';

function HomePage() {
  const [user, setUser] = useState(null);
  let navigate = useNavigate();
  const auth = getAuth();

  // Check if user is logged in
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

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <div className="App">
      <NavBar user={user} setUser={setUser} />
      <div className="landingPage">
        {/* Hero Section */}
        <div className="heroSection">
          <h1 className="heroTitle">
            {user ? `Welcome, ${user.displayName || 'User'} to Virtual Diary` : 'Welcome to Virtual Diary'}
          </h1>
          <p className="heroDescription">
            Capture your moments, organize your thoughts, and visualize your memories with Virtual Diary. Your personal space to reflect, plan, and grow.
          </p>
          <button className="getStartedButton" onClick={() => goToPage(user ? './cameraPage' : './auth')}>
            Get Started
          </button>
         </div>

        {/* Features Section */}
        <div className="featuresSection">
          <h2>Explore the Features of Virtual Diary</h2>
          <div className="featuresGrid">
            <div className="featureCard">
              <h3>Calendar</h3>
              <p>View and manage your daily entries with an interactive calendar.</p>
              <button onClick={() => goToPage('./calendarPage')}>View Calendar</button>
            </div>
            <div className="featureCard">
              <h3>Gallery</h3>
              <p>Browse through your saved images and notes in one place.</p>
              <button onClick={() => goToPage('./galleryPage')}>Open Gallery</button>
            </div>
            <div className="featureCard">
              <h3>Trends</h3>
              <p>Analyze your entries and discover patterns in your thoughts and activities.</p>
              <button onClick={() => goToPage('./trendsPage')}>View Trends</button>
            </div>
            <div className="featureCard">
              <h3>Capture Moments</h3>
              <p>Use the camera to instantly save images and notes for your diary.</p>
              <button onClick={() => goToPage('./cameraPage')}>Capture Now</button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="ctaSection">
          <h2>Start Documenting Your Journey Today</h2>
          <p>Join countless users who are preserving their memories and organizing their lives with Virtual Diary.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
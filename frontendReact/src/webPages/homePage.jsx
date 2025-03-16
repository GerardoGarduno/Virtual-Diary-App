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
//added useEffect to check if user is logged in
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

  const routeChange = () => {
    let path = './walletPage';
    navigate(path);
  };

  const goCamera = () => {
    let path = './cameraPage';
    navigate(path);
  };

  return (
    
    <div className="App">
      <NavBar user={user} setUser={setUser} />
      <div className="centerBlock">
        <div className="chooseOption"><h3>Choose Option</h3></div>
        <button className="groupofButton1" onClick={goCamera}>Camera</button>
        <button className="groupofButton2" onClick={routeChange}>Virtual Wallet</button>
      </div>
      <img src={logo} className="logo" alt="logo" />
    </div>
  );
}

export default HomePage;
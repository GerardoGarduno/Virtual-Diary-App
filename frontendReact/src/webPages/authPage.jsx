import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import NavBar from '../components/NavBar'; // Import NavBar component
import './webPages.css';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [user, setUser] = useState(null);
  let navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate('/'); // Redirect to the home page if the user is logged in
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);
  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setFeedback('User registered successfully!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setFeedback('Email already in use. Please use a different email.');
        } else {
          setFeedback(`Error registering: ${error.message}`);
        }
      });
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {feedback && <p className="feedback">{feedback}</p>}
      </div>
    </div>
  );
}

export default AuthPage;
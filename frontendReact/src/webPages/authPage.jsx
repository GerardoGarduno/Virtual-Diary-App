import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import NavBar from '../components/NavBar'; // Import NavBar component
import './webPages.css';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const auth = getAuth();

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
      <NavBar user={null} setUser={() => {}} /> {/* Add NavBar */}
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
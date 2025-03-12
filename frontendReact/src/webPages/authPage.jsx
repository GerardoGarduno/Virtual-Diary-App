import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import './webPages.css';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [feedback, setFeedback] = useState('');
  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
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
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setFeedback('User signed in successfully!');
        })
        .catch((error) => {
          if (error.code === 'auth/wrong-password') {
            setFeedback('Incorrect password. Please try again.');
          } else if (error.code === 'auth/user-not-found') {
            setFeedback('No user found with this email. Please register first.');
          } else {
            setFeedback(`Error signing in: ${error.message}`);
          }
        });
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? 'Register' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isRegistering ? 'Register' : 'Sign In'}</button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Sign In' : 'Don\'t have an account? Register'}
      </button>
    </div>
  );
}

export default AuthPage;
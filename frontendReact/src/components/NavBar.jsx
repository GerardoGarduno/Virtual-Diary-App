import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import './NavBar.css';

function NavBar({ user, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();
  const auth = getAuth();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          alert('Incorrect password. Please try again.');
        } else if (error.code === 'auth/user-not-found') {
          alert('No user found with this email. Please register first.');
        } else {
          alert(`Error signing in: ${error.message}`);
        }
      });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      console.log('User signed out');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const goAuth = () => {
    navigate('/auth');
  };

  return (
    <div className='navbody'>
      <nav>
        <a className="brand" onClick={() => navigate('/')}>Virtual Diary</a>
        {user ? (
          <div className='container'>
            <a className="UserEmail">Logged in as: {user.email}</a>
            <a><button className="ProfileButton" onClick={() => navigate('/profile')}>Profile</button></a>
            <a><button className="SignOutButton" onClick={handleSignOut}>Sign Out</button></a>
          </div>
        ) : (
          <div className='container'>
            <form onSubmit={handleSignIn}>
              <input
                className='UserEmail'
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className='UserEmail'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className ="SignInButton"type="submit">Sign In</button>
            </form>
            <button className = "RegisterButton"onClick={goAuth}>Register</button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
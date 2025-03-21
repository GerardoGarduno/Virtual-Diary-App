import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail, updatePassword, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Import NavBar component
import './ProfilePage.css';

function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  // Check if user is logged in for NavBar and page access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/'); // Redirect to the home page if the user is not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleUpdateUsername = () => {
    if (newUsername) {
      updateProfile(user, { displayName: newUsername })
        .then(() => setFeedback('Username updated successfully!'))
        .catch((error) => setFeedback(`Error updating username: ${error.message}`));
    }
  };

  const handleUpdateEmail = () => {
    if (newEmail) {
      updateEmail(user, newEmail)
        .then(() => setFeedback('Email updated successfully!'))
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            setFeedback('This email is already in use. Please use a different email.');
          } else {
            setFeedback(`Error updating email: ${error.message}`);
          }
        });
    }
  };

  const handleUpdatePassword = () => {
    if (newPassword && currentPassword) {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // Update the password after re-authentication
          updatePassword(user, newPassword)
            .then(() => setFeedback('Password updated successfully!'))
            .catch((error) => setFeedback(`Error updating password: ${error.message}`));
        })
        .catch((error) => {
          if (error.code === 'auth/wrong-password') {
            setFeedback('The current password is incorrect.');
          } else {
            setFeedback(`Error re-authenticating: ${error.message}`);
          }
        });
    } else {
      setFeedback('Please enter your current password and a new password.');
    }
  };

  return (
    <div className="profilePage">
      {/* Include NavBar */}
      {user && <NavBar user={user} setUser={setUser} />}
      <h1>Profile</h1>
      {user && (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.displayName || 'Not set'}</p>
          <p><strong>User Since:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
        </>
      )}

      <div className="updateSection">
        <h2>Update Profile</h2>
        <div>
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button onClick={handleUpdateUsername}>Update Username</button>
        </div>
        <div>
          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button onClick={handleUpdateEmail}>Update Email</button>
        </div>
        <div>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleUpdatePassword}>Update Password</button>
        </div>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}

export default ProfilePage;
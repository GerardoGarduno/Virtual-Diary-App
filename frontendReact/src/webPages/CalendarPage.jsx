import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import NavBar from '../components/NavBar';
import './webPages.css';

function CalendarPage() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]); // Store diary entries
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date
  const [filteredEntries, setFilteredEntries] = useState([]); // Entries for the selected date
  const [selectedImage, setSelectedImage] = useState(null);
  const auth = getAuth();

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchEntries(user.uid); // Fetch diary entries for the logged-in user
      } else {
        setUser(null);
        setEntries([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch diary entries from Firebase
  const fetchEntries = (userId) => {
    const db = getDatabase();
    const userEntriesRef = dbRef(db, `users/${userId}/images`);
    onValue(userEntriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object into an array of entries
        const entriesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setEntries(entriesArray);
      } else {
        setEntries([]);
      }
    });
  };

  // Filter entries for the selected date
  useEffect(() => {
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp).toDateString();
      return entryDate === selectedDate.toDateString();
    });
    setFilteredEntries(filtered);
  }, [selectedDate, entries]);

  return (
    <div>
        <NavBar user={user} setUser={setUser} />
        <div className="calendarPage">
            <h1>Diary Calendar</h1>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                if (entries.some((entry) => new Date(entry.timestamp).toDateString() === date.toDateString())) {
                    return 'highlight';
                }
                return null;
                }}
            />
            <div className="imagePreview">
                {selectedImage && user ? (
                <img src={selectedImage} alt="Selected Entry" />
                ) : (
                <p>Select an entry to preview the image</p>
                )}
            </div>
            <div className="entriesList">
                <h2>Entries for {selectedDate.toDateString()}</h2>
                {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                    <div key={entry.id} className="entryCard"
                    
                    onClick={() => setSelectedImage(entry.imageData)} // Set the selected image on click

                    >
                    <p><strong>Mood:</strong> {entry.mood}</p>
                    <p><strong>Note:</strong> {entry.note}</p>
                    <p><strong>Uploaded:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                ))
                ) : (
                <p>No entries for this date.</p>
                )}
            </div>
            </div>
    </div>
  );
}

export default CalendarPage;
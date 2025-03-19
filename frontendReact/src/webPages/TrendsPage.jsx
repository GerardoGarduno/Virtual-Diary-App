import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { Line, Pie } from 'react-chartjs-2'; // Import chart components
import Calendar from 'react-calendar'; // Import react-calendar
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import NavBar from '../components/NavBar';
import './trendsStyle.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function TrendsPage() {
  const [user, setUser] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchMoodData(user.uid); // Fetch mood data for the logged-in user

      } else {
        setUser(null);
        setMoodData([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchMoodData = (userId) => {
    console.log('Fetching mood data for user:', userId);
    const db = getDatabase();
    const userImagesRef = dbRef(db, `users/${userId}/images`); // Adjusted path to "images"
    console.log('User images ref:', userImagesRef);
  
    // Listen for changes in the database
    onValue(userImagesRef, (snapshot) => {
      const data = snapshot.val(); // Get the data from the snapshot
      console.log('Data:', data); // Log the raw data for debugging
  
      if (data) {
        // Convert the object into an array of mood entries
        const moodArray = Object.entries(data).map(([key, value]) => ({
          id: key, // Include the key as an ID
          mood: value.mood,
          date: new Date(value.timestamp).toLocaleDateString(),
        }));
        console.log('Mood data:', moodArray); // Log the processed mood data
        setMoodData(moodArray); // Update the state with the mood data
      } else {
        console.log('No mood data found.');
        setMoodData([]); // Set an empty array if no data is found
      }
    }, (error) => {
      console.error('Error fetching mood data:', error); // Log any errors
    });
  };
  // Process data for the charts
  const processMoodData = () => {
    const moodCounts = {};
    const moodTrends = {};

    moodData.forEach(({ mood, date }) => {
      // Count moods for the pie chart
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;

      // Group moods by date for the line chart
      if (!moodTrends[date]) {
        moodTrends[date] = { Happy: 0, Sad: 0, Neutral: 0 };
      }
      moodTrends[date][mood] = (moodTrends[date][mood] || 0) + 1;
    });

    // Prepare data for the line chart
    const dates = Object.keys(moodTrends).sort((a, b) => new Date(a) - new Date(b));
    const happyCounts = dates.map((date) => moodTrends[date].Happy || 0);
    const sadCounts = dates.map((date) => moodTrends[date].Sad || 0);
    const neutralCounts = dates.map((date) => moodTrends[date].Neutral || 0);

    return { moodCounts, dates, happyCounts, sadCounts, neutralCounts };
  };
  const { moodCounts, dates, happyCounts, sadCounts, neutralCounts } = processMoodData();

  //Heat map
   // Process mood data for the heatmap
   const processMoodHeatmapData = () => {
    const moodMap = {};

    moodData.forEach(({ mood, date }) => {
      if (!moodMap[date]) {
        moodMap[date] = { Happy: 0, Sad: 0, Neutral: 0 };
      }
      moodMap[date][mood] = (moodMap[date][mood] || 0) + 1;
    });

    // Determine the dominant mood for each day
    const heatmapData = {};
    Object.keys(moodMap).forEach((date) => {
      const moods = moodMap[date];
      const dominantMood = Object.keys(moods).reduce((a, b) => (moods[a] > moods[b] ? a : b));
      heatmapData[date] = dominantMood;
    });

    return heatmapData;
  };

  const heatmapData = processMoodHeatmapData();
   // Function to get the color for a mood
   const getMoodColor = (mood) => {
    switch (mood) {
      case 'Happy':
        return '#4caf50'; // Green
      case 'Sad':
        return '#f44336'; // Red
      case 'Neutral':
        return '#ffeb3b'; // Yellow
      default:
        return '#e0e0e0'; // Gray for no data
    }
  };

  // Customize calendar tiles
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toLocaleDateString();
      const mood = heatmapData[formattedDate];
      if (mood) {
        return (
          <div
            style={{
              backgroundColor: getMoodColor(mood),
              borderRadius: '50%',
              width: '80%',
              height: '80%',
              margin: 'auto',
            }}
          ></div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <div className="trendsPage">
        <h1>Emotion Trends</h1>
        <div className="chartContainer">
          <h2>Mood Heatmap</h2>
          <Calendar
            tileContent={tileContent} // Add custom tile content
          />
        </div>
        <div className="chartContainer">
          <h2>Mood Distribution</h2>
          <Pie
            data={{
              labels: Object.keys(moodCounts),
              datasets: [
                {
                  data: Object.values(moodCounts),
                  backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'], // Colors for Happy, Sad, Neutral
                },
              ],
            }}
          />
        </div>
        <div className="chartContainer">
          <h2>Mood Trends Over Time</h2>
          <Line
            data={{
              labels: dates,
              datasets: [
                {
                  label: 'Happy',
                  data: happyCounts,
                  borderColor: '#4caf50',
                  fill: false,
                },
                {
                  label: 'Sad',
                  data: sadCounts,
                  borderColor: '#f44336',
                  fill: false,
                },
                {
                  label: 'Neutral',
                  data: neutralCounts,
                  borderColor: '#ffeb3b',
                  fill: false,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TrendsPage;
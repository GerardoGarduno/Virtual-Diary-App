import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import homePage from './webPages/homePage';
import galleryPage from './webPages/gallaryPage';
import cameraPage from './webPages/cameraPage';
import authPage from './webPages/authPage';
import CalendarPage from './webPages/CalendarPage';
import TrendsPage from './webPages/TrendsPage';
import ProfilePage from './webPages/ProfilePage';


function App() {

  return (
    <div className="App">
    <Router>
        <Routes>
          <Route exact path = '/' Component={homePage}/>
          <Route exact path = '/galleryPage' Component= {galleryPage}/>
          <Route exact path = '/cameraPage' Component={cameraPage}/>
          <Route exact path='/auth' Component= {authPage} />
          <Route path="/calendarPage" element={<CalendarPage/>} />
          <Route path="/trendsPage" element={<TrendsPage/>} />
          <Route path="/profile" element={<ProfilePage />} /> {/* New Profile Page */}
        </Routes>
    </Router>


    </div>

  )
}

export default App;

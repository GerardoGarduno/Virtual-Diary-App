import React, { useState, useEffect } from 'react';
import walletlogo from '../assets/walletlogo.jpeg';
import {useNavigate , BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./webPages.css";
import NavBar from '../components/NavBar'; // Adjust the path if necessary
import { getAuth, onAuthStateChanged } from "firebase/auth";

function WalletPage() {
  const [bills, setBills] = useState([]);
  const [total, setTotal] = useState(null);
  const [user, setUser] = useState(null); // Add user state if needed
  const auth = getAuth();

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
  //fetching the data from the backend
  function getData() {
    fetch('http://localhost:5000/total')
      .then(response => response.json())
      .then(data => {
        setTotal(data.total);
      });
  
    fetch('http://localhost:5000/bills')
      .then(response => response.json())
      .then(data => {
        setBills(data.bills);
      });
  }
  //useEffect allows the page to get the Data from reload
  useEffect(() => {
    getData();
  }, []); // empty dependency array ensures this only runs once on mount

  let navigate = useNavigate(); 
  const goHome = () =>{ 
    let path = '/'; 
    navigate(path);
  }
  const goCamera= () =>{
    path = '/cameraPage'
    navigate(path);
    
  }
  function sortBills(column) {
    // make a copy of the bills array to avoid modifying the original
    const sortedBills = [...bills];
  
    // sort the bills based on the selected column
    sortedBills.sort((a, b) => {
      if (column === 'bill') {
        return a.label.localeCompare(b.label);
      } else {
        return b.confidence - a.confidence;
      }
    });
  
    // update the bills state with the sorted array
    setBills(sortedBills);
  }
  return (
    <div>
      {/* <NavBar user={user} setUser={setUser} /> */}
      {/* <div className="NavBar">
          <ul>
            <li className = "MoneyCounter" ><a onClick={goHome}>MoneyCounter</a></li>
          </ul>
      </div> */}
      <NavBar user={user} setUser={setUser} /> {/* Add NavBar here */}

      <img src={walletlogo} className="logo" alt="logo" />
      <div className="toolBar">
        <h1>Current Amount in wallet:</h1>
        <h2>{total} $</h2>
      </div>
      <table className="BillsInWallet">
      <thead>
        <tr>
          <th>Bill</th>
          <th onClick={() => sortBills('confidence')}>Confidence</th>
        </tr>
      </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={index}>
              {/* <td>{bill.label}</td> */}
              <td> {parseInt(bill.label)}</td>
              <td>{bill.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WalletPage;

// App.js
import { useState } from "react";
import { data } from "./utils/Data";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import RadarChart from "./components/RadarChart";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import Home from "./Home";
import About from "./About"; 
import Contact from "./Contact"; 
import { StyledLink } from "./styles";   
import Chart from 'chart.js/auto';  

export default function App() {
  const [chartData, setChartData] = useState({
    labels: data.map((data) => data.year), 
    datasets: [
      {
        label: "Users Gained ",
        data: data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  return (
    <>
      <section className="App">
      <Router>
        <nav>
          <StyledLink to="/">Home</StyledLink>
          <StyledLink to="/about-us">About us</StyledLink>
          <StyledLink to="/contact">Contact</StyledLink>  
        </nav> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} /> 
        </Routes> 
      </Router>
    </section>  

      <div className="App">
        <PieChart chartData={chartData} /> 
        <BarChart chartData={chartData} />      
        <LineChart chartData={chartData} />
        <RadarChart chartData={chartData} />
      </div>
    </>
    
  );
} 
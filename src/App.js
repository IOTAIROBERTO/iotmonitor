// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import { useState } from "react"; 
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import RadarChart from "./components/RadarChart"; 
import { data } from "./utils/Data.js";
import {fetchData} from './utils/AwsFunctions_.js';
import Home from "./Home";
import About from "./About"; 
import Contact from "./Contact"; 
import { StyledLink } from "./styles";   
import Chart from 'chart.js/auto';  

import "./App.css";

export default function App() {
   const fetchDataFormDynamoDb = () => {
     fetchData('iotmonitor');
  };

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
    <div className="FetchData">
    <button onClick={() => fetchDataFormDynamoDb()}> Fetch </button>
    </div> 
  
       <div className="App">
         <PieChart chartData={chartData} /> 
         <BarChart chartData={chartData} />      
         <LineChart chartData={chartData} />
         <RadarChart chartData={chartData} />
       </div>
       </> );
}
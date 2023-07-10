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
//import { data } from "./utils/Data.js";
//import { fetchData } from './utils/AwsFunctions.js';
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import { StyledLink } from "./styles";
import Chart from 'chart.js/auto';
import "./App.css";

const AWS = require('aws-sdk');
var DynamoDB = require('aws-sdk/clients/dynamodb'); //This doesn't work, I get an undefined error below

export default function App() {
  
  //const fetchDataFormDynamoDb = () => {
  //   fetchData('iotmonitor');     
  //};

  var ddbDocClient = new DynamoDB.DocumentClient({region: "us-east-2", accessKeyId: 'AKIAVTQBHSP373NE63NH', secretAccessKey: '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' }); 

  ddbDocClient.scan({
    TableName: "iotmonitor"
  })
  .promise()
  .then(data => setOutput(JSON.stringify(data))) //console.log(JSON.stringify(data.Items)))
  .catch(console.error)  

 const setOutput = (rows) => 
 { 
     const ddbData = JSON.parse(rows);
    console.log("ddbData: " + ddbData);
   console.log(ddbData)
   console.log(typeof ddbData) 
   console.log(JSON.stringify(ddbData))
   console.log(typeof JSON.stringify(ddbData)) 

  let iterationCount = 0;
  for (let i = 0; i < 20; i += 1) {  
      console.log(ddbData['Items'][i]['payload'].bearing);   
  } 
}

  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  const [chartData] = useState({
     labels: data.map((data) => data.year), 
     datasets: [
       {
         label: "Users Gained ",
         data: data.map((data) => data.count),
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
  
       <div className="App">
         <LineChart chartData={chartData} />
         {/* <PieChart chartData={chartData} /> 
         <BarChart chartData={chartData} />      
         <RadarChart chartData={chartData} /> */}
       </div>
       </> );
       
}
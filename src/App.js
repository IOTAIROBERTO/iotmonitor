// App.js
//'use strict';
import React from "react";
// import {
//   BrowserRouter as Router,
//   Route, Routes
// } from "react-router-dom";
//import { useState } from "react";
// import PieChart from "./components/PieChart";
// import BarChart from "./components/BarChart";
// import LineChart from "./components/LineChart";
// import RadarChart from "./components/RadarChart";
//import { data } from "./utils/Data.js";
//import { fetchData } from './utils/AwsFunctions.js';
// import Home from "./Home";
// import About from "./About";
// import Contact from "./Contact";
// import { StyledLink } from "./styles";
import Chart from 'chart.js/auto';
import "./App.css";
//import { GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
const AWS = require('aws-sdk');   
const DynamoDB = new AWS.DynamoDB({ region: "us-east-2", accessKeyId: 'AKIAVTQBHSP373NE63NH', secretAccessKey: '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' });
const { /*marshall,*/ unmarshall } = require("@aws-sdk/util-dynamodb");

export default function App() 
{
  var ddbData = {}; 
  var data = {};
  let configuration = 0;
  var ctx;
  let myChart;

  let params = {
    TableName: 'iotaimonitor',
    KeyConditionExpression: 'id = :hashKey',
    ExpressionAttributeValues: {
      ":hashKey": {"S": "8/8/2023"}
    },
    Limit: 5,
    ScanIndexForward: false
  }   

  //setTimeout(fetchDataFormDynamoDb(), 1500);
  fetchDataFormDynamoDb()

  async function fetchDataFormDynamoDb() 
  {  
    ddbData = await DynamoDB.query(params).promise().then((data) => {    
      return data;
    })   

    for (let i = 0; i < 4; i += 1)  console.log(ddbData['Items'][i]['record'].N);         

    for (let i = 0; i < 4; i += 1)  console.log(ddbData['Items'][i]['payload']['M']['bearing'].N);        
    
    console.log(ddbData);  

    data = [ 
       { count: new Date(ddbData['Items'][0]['record'].N*1000).toLocaleString(), bearing: ddbData['Items'][0]['payload']['M']['bearing'].N}, 
       { count: new Date(ddbData['Items'][1]['record'].N*1000).toLocaleString(), bearing: ddbData['Items'][1]['payload']['M']['bearing'].N},
       { count: new Date(ddbData['Items'][2]['record'].N*1000).toLocaleString(), bearing: ddbData['Items'][2]['payload']['M']['bearing'].N},
       { count: new Date(ddbData['Items'][3]['record'].N*1000).toLocaleString(), bearing: ddbData['Items'][3]['payload']['M']['bearing'].N},
       { count: new Date(ddbData['Items'][4]['record'].N*1000).toLocaleString(), bearing: ddbData['Items'][4]['payload']['M']['bearing'].N}
    ];
 
    console.log(data);  

    ctx = document.getElementById('myChart').getContext('2d');
    configuration = {
      type: 'line',
      data: {
        labels: data.map((data) => data.count),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map((data) => data.bearing),
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
      }
    };  

    if (myChart) {
      myChart.destroy();
      myChart = new Chart(ctx, configuration);
    } else {
      myChart = new Chart(ctx, configuration);
    }
  }

  return (
    <> 
      <div className="App">
      <canvas id="myChart" width="400" height="400"></canvas> 
      </div>
    </>
  );
}
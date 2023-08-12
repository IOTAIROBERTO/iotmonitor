// App.js
'use strict';
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
import { GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
const AWS = require('aws-sdk');
var DynamoDB = require('aws-sdk/clients/dynamodb'); //This doesn't work, I get an undefined error below

export default function App() {

  let ddbDocClient = new DynamoDB.DocumentClient({ region: "us-east-2", accessKeyId: 'AKIAVTQBHSP373NE63NH', secretAccessKey: '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' });
  var results = {};
  var ddbData = {};

  //fetchDataFormDynamoDb();

  setTimeout(fetchDataFormDynamoDb, 1500); 

  async function fetchDataFormDynamoDb() {
    let params = {
      TableName: 'iotaimonitor',
      Limit: 5,
      ScanIndexForward: false
    } 

    let result = await ddbDocClient.scan(params).promise().then((data) => {
       return data
     })

    // Now you can use result outside of the promise.
    console.log(JSON.stringify(result))
    ddbData = JSON.parse(JSON.stringify(result));
    console.log(ddbData); 

    const data = [
      { count: new Date(ddbData['Items'][0]['record']*1000).toLocaleString(), bearing: ddbData['Items'][0]['payload'].bearing }, 
      { count: new Date(ddbData['Items'][1]['record']*1000).toLocaleString(), bearing: ddbData['Items'][1]['payload'].bearing },
      { count: new Date(ddbData['Items'][2]['record']*1000).toLocaleString(), bearing: ddbData['Items'][2]['payload'].bearing },
      { count: new Date(ddbData['Items'][3]['record']*1000).toLocaleString(), bearing: ddbData['Items'][3]['payload'].bearing },
      { count: new Date(ddbData['Items'][4]['record']*1000).toLocaleString(), bearing: ddbData['Items'][4]['payload'].bearing }
    ];

    console.log(data)

    //var ctx = document.getElementById('myChart'); // node
    var ctx = document.getElementById('myChart').getContext('2d'); // 2d context
    //var ctx = 'myChart'; // element id

    var myChart = new Chart(ctx, {
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
    }
    );

    // const [chartData] = useState({
    //   labels: data.map((data) => data.count),
    //   datasets: [
    //     {
    //       label: "Users Gained ",
    //       data: data.map((data) => data.year),

    //     }
    //   ]
    // });

    //for (let i = 0; i < ddbData.length; i += 1) { 
    // console.log(ddbData['Items'][i]['payload'].bearing);
    // }

  };
  //console.log(chartData);

  return (
    <>
      <canvas id="myChart" width="400" height="400"></canvas>

      <div className="App">
        {/*<LineChart chartData={chartData} />*/}
      </div>
    </>
  );
}
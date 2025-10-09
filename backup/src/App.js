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
import { TabulatorFull as Tabulator } from 'tabulator-tables';
const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB({ region: "us-east-2", accessKeyId: 'AKIAVTQBHSP373NE63NH', secretAccessKey: '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' });

let myChart = null;

export default function App() 
{
  var ddbData = {};
  var data = {};
  var ctx;
  let configuration = 0;

  let params = {
    TableName: 'iotmonitor',
    KeyConditionExpression: 'id = :hashKey',
    ExpressionAttributeValues: {
      ":hashKey": { "S": "raspberry" }
    },
    Limit: 5,
    ScanIndexForward: false
  }

  setInterval(fetchDataFormDynamoDb, 16000);
  //fetchDataFormDynamoDb()

  async function fetchDataFormDynamoDb() {
    // ddbData = await DynamoDB.query(params).promise().then((data,err) => {    
    // console.log(data,err);  
    //   return data;
    // });   

    try {
      ddbData = await DynamoDB.query(params).promise()
    } catch (error) {
      console.error(error);
    }

    //for (let i = 0; i < 4; i += 1)  console.log(ddbData['Items'][i]['record'].N);         
    //for (let i = 0; i < 4; i += 1)  console.log(parseFloat(ddbData['Items'][i]['payload']['M']['distance'].S));        
    //console.log(ddbData);  

    data = [
      //  { record: new Date(ddbData['Items'][4]['record'].N*1000).toLocaleString(), distance: parseFloat(ddbData['Items'][4]['payload']['M']['distance'].S)}, 
      //  { record: new Date(ddbData['Items'][3]['record'].N*1000).toLocaleString(), distance: parseFloat(ddbData['Items'][3]['payload']['M']['distance'].S)},
      //  { record: new Date(ddbData['Items'][2]['record'].N*1000).toLocaleString(), distance: parseFloat(ddbData['Items'][2]['payload']['M']['distance'].S)},
      //  { record: new Date(ddbData['Items'][1]['record'].N*1000).toLocaleString(), distance: parseFloat(ddbData['Items'][1]['payload']['M']['distance'].S)},
      //  { record: new Date(ddbData['Items'][0]['record'].N*1000).toLocaleString(), distance: parseFloat(ddbData['Items'][0]['payload']['M']['distance'].S)}
      { record: new Date(ddbData['Items'][4]['record'].N * 1000).toLocaleString(), distance: parseFloat(ddbData['Items'][4]['distance'].S) },
      { record: new Date(ddbData['Items'][3]['record'].N * 1000).toLocaleString(), distance: parseFloat(ddbData['Items'][3]['distance'].S) },
      { record: new Date(ddbData['Items'][2]['record'].N * 1000).toLocaleString(), distance: parseFloat(ddbData['Items'][2]['distance'].S) },
      { record: new Date(ddbData['Items'][1]['record'].N * 1000).toLocaleString(), distance: parseFloat(ddbData['Items'][1]['distance'].S) },
      { record: new Date(ddbData['Items'][0]['record'].N * 1000).toLocaleString(), distance: parseFloat(ddbData['Items'][0]['distance'].S) }
    ]; 
    console.log(data);

    ctx = document.getElementById("myChart").getContext('2d'); 

    configuration = {
      type: 'line',
      data: {
        labels: data.map((data) => data.record),
        datasets: [
          {
            label: 'Distance',
            data: data.map((data) => data.distance),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0"
            ],
            borderColor: "red",
            borderWidth: 2,
          }
        ]
      },
      options: {
        animation: {
          duration: 0
        }
      }
    }
     if (myChart != null) myChart.destroy();
     myChart = new Chart(ctx, configuration); 
  } 

  return (
    <> 
      <div className="App">
      <canvas id="myChart" width="1024" height="512"></canvas> 
      </div>
    </>
  );

}

    /*console.log(data);    
    
    ctx = document.getElementById("myChart").getContext('2d');

    configuration = {
      type: 'line',
      data: {
        labels: data.map((data) => data.record),
        datasets: [
          {
            label: 'Distance',
            data: data.map((data) => data.distance),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0"
            ],
            borderColor: "red",
            borderWidth: 2, 
          }
        ]
      },
  options: {
    animation: {
        duration: 0
    }
    }  
  } 

  var table = new Tabulator("#example-table", {
    data:data, //assign data to table
    autoColumns:true, //create columns from data field names
});
  }

  return (
    <>  
      <div className="App">
      <canvas id="myChart" width="1024" height="512"></canvas> 
      </div>.
      <div id="example-table"></div> 
    </>
  );
}*/
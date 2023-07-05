import React from "react";
import ReactDOM from "react-dom";
import App from "../App";   
const AWS = require('aws-sdk');
var DynamoDB = require('aws-sdk/clients/dynamodb'); //This doesn't work, I get an undefined error below
 
global.ddbData = {} 

export const fetchData = (tableName) =>   {   

  var ddbDocClient = new DynamoDB.DocumentClient({region: "us-east-2", accessKeyId: 'AKIAVTQBHSP373NE63NH', secretAccessKey: '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' }); 

  ddbDocClient.scan({
    TableName: "iotmonitor"
  })
  .promise()
  .then(data => setOutput(JSON.stringify(data))) //console.log(JSON.stringify(data.Items)))
  .catch(console.error) 
} 

const setOutput = (rows) => 
{ 
  const ddbData = JSON.parse(rows);
  console.log(ddbData)
  console.log(typeof ddbData) 

  let iterationCount = 0;
  for (let i = 0; i < 20; i += 1) {  
      console.log(ddbData['Items'][i]['payload'].bearing);   
  } 

  console.log(JSON.stringify(ddbData))
  console.log(typeof JSON.stringify(ddbData)) 
} 

const rootElement = document.getElementById("root");
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    rootElement
);

export default fetchData
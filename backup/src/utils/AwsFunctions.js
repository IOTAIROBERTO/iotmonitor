// import React from "react";
// import ReactDOM from "react-dom";
// import App from "../App";   
// const AWS = require('aws-sdk');
// var DynamoDB = require('aws-sdk/clients/dynamodb'); //This doesn't work, I get an undefined error below

// export const fetchData = (tableName) =>   {    
//   var ddbDocClient = new DynamoDB.DocumentClient({region: "us-east-2", accessKeyId: 'AKIAVTQBHSP373NE63NH', secretAccessKey: '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' }); 

//   ddbDocClient.scan({
//     TableName: "iotmonitor"
//   })
//   .promise()
//   .then(data => setOutput(JSON.stringify(data))) //console.log(JSON.stringify(data.Items)))
//   .catch(console.error) 
// }

// export const ddbData = {};
// export const setOutput = (rows) => 
// { 
//      ddbData = JSON.parse(rows);
// //   console.log("ddbData: " + ddbData);
// //   console.log(ddbData)
// //   console.log(typeof ddbData) 
// //   console.log(JSON.stringify(ddbData))
// //   console.log(typeof JSON.stringify(ddbData)) 

//   let iterationCount = 0;
//   for (let i = 0; i < 20; i += 1) {  
//       console.log(ddbData['Items'][i]['payload'].bearing);   
//   } 
// }

// const [chartData] = useState({
//     labels: data.map((data) => data.year), 
//     datasets: [
//       {
//         label: "Users Gained ",
//         data: data.map((data) => data.userGain),
//         backgroundColor: [
//           "rgba(75,192,192,1)",
//           "#ecf0f1",
//           "#50AF95",
//           "#f3ba2f",
//           "#2a71d0"
//         ],
//         borderColor: "black",
//         borderWidth: 2
//       }
//     ]
//   });



// const rootElement = document.getElementById("root");
// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     rootElement
// ); 

// //export { ddbData, setOutput, fetchData }
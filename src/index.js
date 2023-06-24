import React from "react";
import ReactDOM from "react-dom"; 
import App from "./App";

// //AWS STARTS HERE
// import * as AWS from 'aws-sdk'
// import { ConfigurationOptions } from 'aws-sdk'

// var configuration = {
//     region: 'us-east-2', 
//     secretAccessKey: 'r+JP4UyNPByzTiKNZc5z5KyUDBhxS6pkUnPFIzVR',
//     accessKeyId: 'AKIAVTQBHSP373NE63NH'
// };

// AWS.config.update(configuration)
// // AWS ENDS HERE

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
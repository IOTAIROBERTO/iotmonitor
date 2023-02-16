import React from "react";
import ReactDOM from "react-dom"; 
import App from "./App";

//AWS STARTS HERE
import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'

var configuration = {
    region: 'us-east-2', 
    secretAccessKey: 'knqJ2Uuu55dRCsx5tIJmaX3RitnX8GivOjnCr6/y',
    accessKeyId: 'AKIAVTQBHSP3RTMNIJPU'
};

AWS.config.update(configuration)
// AWS ENDS HERE

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
import React from "react";
import ReactDOM from "react-dom"; 
import App from "./App";

//AWS STARTS HERE
import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'

var configuration = {
    region: 'us-east-2',
    secretAccessKey: 'AKIAVTQBHSP3X5PFALPM',
    accessKeyId: 'K1iIvq4tpCZoKL2X5pYlIK1XzikJF/VtPfQ9FSiL'
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
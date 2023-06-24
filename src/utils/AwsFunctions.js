import React from "react";
import ReactDOM from "react-dom"; 
import App from "../App"; 
import * as AWS from "aws-sdk"; 
import { DynamoDB } from "aws-sdk"



//const dynamodb = new AWS.DynamoDB();

export const fetchData = (tableName) => {   

    // var configuration = {
    //     region: 'us-east-2', 
    //     secretAccessKey: 'r+JP4UyNPByzTiKNZc5z5KyUDBhxS6pkUnPFIzVR',
    //     accessKeyId: 'AKIAVTQBHSP373NE63NH'
    // };
    
    // AWS.config.update(configuration);

    const dynamodb = new DynamoDB({ 
        region: 'us-east-2', 
        secretAccessKey: 'r+JP4UyNPByzTiKNZc5z5KyUDBhxS6pkUnPFIzVR',
        accessKeyId: 'AKIAVTQBHSP373NE63NH'
      });
      
   dynamodb.listTables({}, (err, data)=>{
       if(err) {
           console.log(err);
       } else {
           console.log(data);
       }
    });
   
    var params = {
        TableName: tableName
    }

    dynamodb.scan(params, function (err, data) {
        if (!err) {
            console.log(data)
        }
    });
} 

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
); 

export default fetchData;  
import React from "react";
import ReactDOM from "react-dom";
import App from "../App";
import * as AWS from "aws-sdk";
import { DynamoDB } from "aws-sdk";
//const { unmarshall } = require("@aws-sdk/util-dynamodb");
import { addValue, dataToItem, deltaToUpdateParams, itemToData } from 'dynamo-converters';

export const fetchData = (tableName) => {

    const dynamodb = new DynamoDB({
        region: 'us-east-2',
        secretAccessKey: 'r+JP4UyNPByzTiKNZc5z5KyUDBhxS6pkUnPFIzVR',
        accessKeyId: 'AKIAVTQBHSP373NE63NH'
    });

    /*
    dynamodb.listTables({}, (err, data)=>{
       if(err) {
           console.log(err);
       } else {
           console.log(data);
       }
    });*/

    var params = {
        TableName: tableName,
        Key:{"payload":payload}
    }

    dynamodb.batchGetItem(params, function(err, data) {

        if (err) {
      
          console.log("Error", err);
      
        } else {
      
          console.log("Success", data);
      
        }
      
      });

      /*
    dynamodb.scan(params, function (err, data) {
        if (!err) {
            console.log("Query succeeded:", data);
            console.log(typeof data);

            const dataTransform = JSON.stringify(data);
            console.log(dataTransform);
            console.log(typeof dataTransform);  
            console.log(AWS.DynamoDB.Converter.unmarshall(data));

            try {
                var dynamodbJson = JSON.parse(data);
                var _result = JSON.stringify(AWS.DynamoDB.Converter.unmarshall(dynamodbJson), null, 4);
                console.log(_result);
            } catch (e) {
                alert("Couldn't unmarshall that. " + e)
            }
        }
    });*/
}



const rootElement = document.getElementById("root");
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    rootElement
);

export default fetchData;  
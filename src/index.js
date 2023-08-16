// import React from "react";
// import ReactDOM from "react-dom"; 
// import App from "./App"; 
import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// const rootElement = document.getElementById("root");
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   rootElement
// );

// setTimeout(function(){
//   window.location.reload(5);
// }, 5000);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
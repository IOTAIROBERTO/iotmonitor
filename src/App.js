import React from "react";
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import Home from "./Home";
import About from "./About"; 
import Contact from "./Contact"; 
import { StyledLink } from "./styles"; 

const App = () => {
  return (
    <section className="App">
      <Router>
        <nav>
          <StyledLink to="/">Home</StyledLink>
          <StyledLink to="/about-us">About us</StyledLink>
          <StyledLink to="/contact">Contact</StyledLink>  
        </nav> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} /> 
        </Routes> 
      </Router>
    </section>  
  );
};

export default App;
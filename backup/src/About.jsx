import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="About">
      <h1>This is the About page</h1>
      <Link to="/contact">Contact</Link>
      <a href="https://google.com">Google</a>
    </section>
  );
};

export default About;
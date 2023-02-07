import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
  useRouteMatch
} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Campaign from "./campaign";
import { StyledLink } from "./styles";

function CampaignLink({ label, to, activeOnlyWhenExact }) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  return (
    <div className={match ? "active" : ""}>
      {match && "*** "}
      <Link to={to}>{label}</Link>
    </div>
  );
}

const App = () => {
  return (
    <section className="App">
      <Router>
        <nav>
          <StyledLink to="/">Home</StyledLink>
          <StyledLink to="/about-us">About us</StyledLink>
          <StyledLink to="/contact">Contact</StyledLink>
          <CampaignLink
            activeOnlyWhenExact={true}
            to="/campaign"
            label="Campaign"
          />
        </nav>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about-us">
            <About />
          </Route>
          <Route path="/contact" render={() => <Redirect to="/" />} />
          <Route path="/campaign">
            <Campaign title={`This is the title of the Campaign page`} />
          </Route>
        </Switch>
      </Router>
    </section>
  );
};

export default App;
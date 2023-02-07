import React from "react";
import { useLocation, Link } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Collection({ name }) {
  return <div>{name}</div>;
}

const Campaign = ({ title }) => {
  let query = useQuery();
  return (
    <section className="Campaign">
      <h1>{title}</h1>
      <ul>
        <li>
          <Link to="/campaign?name=sunglasses">Sunglasses</Link>
        </li>
        <li>
          <Link to="/campaign?name=dresses">Dresses</Link>
        </li>
      </ul>
      <Collection name={query.get("name")} />
    </section>
  );
};

export default Campaign;
import React from "react";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";

const Home = () => {
  return (
    <Layout>
      <NavBar />
      <div className="page-content">
        <h1 className="page-heading">
          Welcome to Punchie Pass
        </h1>
        <p className="page-text">
          This is the home page. Use the navigation to explore the app features.
        </p>
      </div>
    </Layout>
  );
};

export default Home;

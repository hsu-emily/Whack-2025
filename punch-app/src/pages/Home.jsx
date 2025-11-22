import React from "react";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";

const Home = () => {
  return (
    <Layout>
      <NavBar />
      <h1>Welcome to Punchie Pass</h1>
      <p>
        This is the home page. Use the navigation to explore the app features.
      </p>
    </Layout>
  );
};

export default Home;

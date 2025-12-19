import React from "react";
import Routes from "./routes";
import Layout from "./components/layout/Layout";
import './App.css'

const App: React.FC = () => {
  return (
    <Layout>
      <Routes />
    </Layout>
  );
};

export default App

import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Connectwallet from "./components/Connectwallet";
import Portfolio from "./components/Portfolio";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

const supportChainIds = [1, 4, 200, 51];
const connectors = {
  injected: {},
};

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ethereum = window.ethereum;
        const ownerAddress = ethereum.selectedAddress; // Get the connected wallet's address
        console.log("Owner Address", ownerAddress);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportChainIds}
      connectors={connectors}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Walletconnect" element={<Connectwallet />} />
        <Route path="/Port" element={<Portfolio />} />
      </Routes>
    </ThirdwebWeb3Provider>
  );
}

export default App;

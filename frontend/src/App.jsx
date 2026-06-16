
import React from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Bank Dashboard</h2>
      </div>
    </div>
  );
}

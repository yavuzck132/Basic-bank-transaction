import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Transfer from "./components/Transfer";
import Credit from "./components/Credit";
import Login from "./components/Login";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={
          <ProtectedRoute>
            <Transfer/>
          </ProtectedRoute>} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

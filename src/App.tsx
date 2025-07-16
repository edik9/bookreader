// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Register } from "./pages/Register";
import "./App.css";
import { AuthProvider } from "./hooks/AuthProvider";
import { Library } from "./pages/Library";
import { GuestLibrary } from "./pages/GuestLibrary";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<Library />} />
          <Route path="/guest-library" element={<GuestLibrary />} />
        </Routes>
      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;

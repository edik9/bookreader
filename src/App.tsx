// import { useState } from 'react'
import { BrowserRouter, Routes} from "react-router-dom";
import "./App.css";
// import { Home } from "./features/Home";
// import { Auth } from "./features/Auth";
// import { Register } from "./features/Register";
// import { AuthProvider } from "./hooks/AuthProvider";
// import { Library } from "./features/Library";
// import { GuestLibrary } from "./features/GuestLibrary";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<Library />} />
          <Route path="/guest-library" element={<GuestLibrary />} /> */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;

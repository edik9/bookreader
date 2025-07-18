// import { useState } from 'react'
import { BrowserRouter} from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppRouter } from "@/app/AppRouter";
import "./index.css";

// import { Auth } from "./features/Auth";
// import { Register } from "./features/Register";
// import { AuthProvider } from "./hooks/AuthProvider";
// import { Library } from "./features/Library";
// import { GuestLibrary } from "./features/GuestLibrary";

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <AppRouter/>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;

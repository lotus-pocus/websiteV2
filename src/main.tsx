// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./index.css";
import "./styles/fonts.css"; // 👈 custom fonts

// ✅ Create root and include a dedicated global cursor portal
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>

    {/* 👇 Global custom cursor portal — outside router/layout */}
    <div id="cursor-root"></div>
  </React.StrictMode>
);

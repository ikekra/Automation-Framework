import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppChrome } from "./app/AppChrome";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppChrome />
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import axios from "axios";

// ✅ Global axios config
// During development, just use the Vite proxy → no need to hardcode baseURL
// In production, we’ll use VITE_API_BASE_URL from .env.production
if (import.meta.env.MODE === "production") {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
} else {
  axios.defaults.baseURL = ""; // ✅ let Vite proxy handle /api
}

axios.defaults.withCredentials = true;

// ✅ ErrorBoundary to prevent white screen on crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
          <h1 className="text-xl font-semibold text-red-600">
            Something went wrong. Please refresh 🔄
          </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

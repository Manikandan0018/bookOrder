import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

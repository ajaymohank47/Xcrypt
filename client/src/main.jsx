import React from "react";
import ReactDOM from "react-dom";

import App from "./App.jsx";
import { TransactionsProvider } from "./context/TransactionContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <TransactionsProvider>
      <App />
    </TransactionsProvider>
  </ThemeProvider>,
)

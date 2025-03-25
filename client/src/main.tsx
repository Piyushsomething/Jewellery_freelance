import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { CartProvider } from "@/lib/contexts/CartContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </ThemeProvider>
);

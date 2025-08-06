import React from "react";

import Navbar from "./layouts/Navbar";
import ScrollToTop from "./layouts/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./theme/ThemeProvider";

export default function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <header>
          <Navbar />
        </header>
        <main className="mt-20">
          <ScrollToTop />
          <AppRoutes />
        </main>
      </ThemeProvider>
    </div>
  );
}

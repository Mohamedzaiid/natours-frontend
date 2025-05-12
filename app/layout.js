import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Providers } from "./providers";
import PerformanceMonitor from "./components/monitoring/PerformanceMonitor";
import CacheDebugger from "./components/monitoring/CacheDebugger";

export const metadata = {
  title: "Natours | Exciting tours for adventurous people",
  description:
    "Explore our exciting tours for the most adventurous experiences around the world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="font-sans">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <PerformanceMonitor />
          {/* {process.env.NODE_ENV !== 'production' && <CacheDebugger />} */}
        </Providers>
      </body>
    </html>
  );
}

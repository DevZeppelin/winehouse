import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "./Nav";
import Footer from "./Footer";
import TickerBar from "./home/TickerBar";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0c2e35",
            color: "#AEFEFF",
            border: "1px solid #1c4d57",
          },
          success: { iconTheme: { primary: "#4FBDBA", secondary: "#072227" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#072227" } },
        }}
      />
      <Nav />
      <TickerBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

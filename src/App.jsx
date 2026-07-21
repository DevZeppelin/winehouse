import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import CabinDetail from "./pages/CabinDetail";
import Publish from "./pages/Publish";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";

const NotFound = () => (
  <div className="mx-auto max-w-xl px-4 py-32 text-center text-lightBlue">
    <h1 className="font-display text-4xl">404</h1>
    <p className="mt-2 text-middleBlue">Esta página no existe.</p>
    <Link to="/" className="mt-4 inline-block font-bold text-orange hover:underline">
      Volver al inicio
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cabanas/:slug" element={<CabinDetail />} />
            <Route path="ingresar" element={<Login />} />
            <Route path="registro" element={<Register />} />
            <Route
              path="publicar"
              element={
                <ProtectedRoute>
                  <Publish />
                </ProtectedRoute>
              }
            />
            <Route
              path="panel"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

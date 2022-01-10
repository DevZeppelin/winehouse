import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Main from "./components/Main";
import Header from "./components/Header";
import Button from "./components/Button";
import CabainPage from "./components/CabainPage";

function App() {
  const [cabains, setCabains] = useState([]);

  const cabainsList = [
    {
      id: 1,
      name: "Cabaña en potrerillos",
      description:
        "Hermoso lugar, con parque, pileta y patio de juegos. Cerca del perilago. La casa cuenta con microondas, heladera, aire, WiFi, y una variedad de libros y discos para nunca aburrite.",
      price: 5000,
      src: "/example.jpg",
      phone: "2616452310",
      mail: "cabañas@gmail.com",
    },
    {
      id: 2,
      name: "Cabaña en Las Vegas",
      description:
        "Un predio amplio, con pileta y jardín. La cabaña está totalmente equipada, lista para disfrutar.",
      price: 3000,
      src: "/01.jpg",
      phone: "2616452310",
      mail: "cabañas@gmail.com",
    },
    {
      id: 3,
      name: "Casita en Vistalva",
      description:
        "Un predio amplio, con pileta y jardín. La cabaña está totalmente equipada, lista para disfrutar.",
      price: 2500,
      src: "/02.jpg",
      phone: "2616452310",
      mail: "cabañas@gmail.com",
    },
    {
      id: 4,
      name: "Cabaña en Potrerillos",
      description:
        "Un predio amplio, con pileta y jardín. La cabaña está totalmente equipada, lista para disfrutar.",
      price: 4000,
      src: "/03.jpg",
      phone: "2616452310",
      mail: "cabañas@gmail.com",
    },
    {
      id: 5,
      name: "Cabaña en El Salto",
      description:
        "Un predio amplio, con pileta y jardín. La cabaña está totalmente equipada, lista para disfrutar.",
      price: 5000,
      src: "/04.jpg",
      phone: "2616452310",
      mail: "cabañas@gmail.com",
    },
    {
      id: 6,
      name: "Casa en Luján de Cuyo",
      description:
        "Un predio amplio, con pileta y jardín. La cabaña está totalmente equipada, lista para disfrutar.",
      price: 6000,
      src: "/05.jpg",
      phone: "2616452310",
      mail: "cabañas@gmail.com",
    },
  ];

  useEffect(() => {
    setCabains(cabainsList);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <>
                <Header />
                <Button />
                <Main cabains={cabains} />
              </>
            }
          />
          <Route
            path="cabains/:cabainId"
            scrollToTop
            element={<CabainPage cabains={cabains} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

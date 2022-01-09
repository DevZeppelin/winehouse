import Cabaña from "./Cabaña"


const Main = () => {
    return (
        <main id="main" className="text-lightBlue w-4/5 mx-auto">
           
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
          <Cabaña
            name="Cabaña en Villaseca"
            description="Cabaña para 4 personas, 2 baños, pileta, patio de jeugos"
            price="4000"
          />
          <Cabaña
            name="Casita en Luján"
            description="Casita completa con todas las comodidades para apsar un fin de semana ideal"
            price="3000"
          />
          <Cabaña
            name="Casa con pileta en Vistalba"
            description="Ideal para eventos, cuenta con baño, parquizado, pileta, cancha de fútbol y ping pong."
            price="2500"
          />
          <Cabaña
            name="Cabaña en Potrerillos"
            description="Hermosa vista, ideal para vacacionar unos días"
            price="3500"
          />
          <Cabaña
            name="Cabaña en El Salto"
            description="Cabaña para 4 personas, 2 baños, pileta, patio de jeugos"
            price="5000"
          />
          <Cabaña
            name="Cabañita en Las Vegas"
            description="Lugar perfecto de bosque encantado, entre las montañas y el río, pasarás un fin de semana desconectado del mundo"
            price="4000"
          />
        </div>
      </main>
    )
}

export default Main

import { useState, useEffect } from "react";

const Nav = () => {
  const [dolar, setDolar] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const toggleNav = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  useEffect(() => {
    const obtenerCotizacion = async () => {
      try {
        const url =
          "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        console.log(resultado);
        setDolar(resultado);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerCotizacion();
  }, []);

  const format = (date, locale, options) =>
    new Intl.DateTimeFormat(locale, options).format(date);

  const now = new Date();

  return (
    <div className="md:grid grid-cols-2 text-background bg-darkBlue font-extrabold text-center py-1 text-base">
      <span className="hidden md:flex justify-start ml-4 text-background md:text-base">
        {format(now, "es", { dateStyle: "long" })}
      </span>

      {loading ? (
        <p className="text-sm md:text-base">Obteniendo datos... </p>
      ) : (
        <>
          <div className="flex gap-2 md:gap-4 justify-end mr-2 md:mr-6 text-sm md:text-base ">
            { !open ? ( <div className="flex gap-2">
              <p className="flex">
                <span className="font-extrabold pr-1">DOLAR:</span>Oficial
                <span className="text-lightBlue pl-1">
                  ${dolar[0].casa.venta}
                </span>
              </p>
              <p className="flex">
                Blue{" "}
                <span className="pl-1 text-lightBlue">
                  ${dolar[1].casa.venta}
                </span>
              </p>
              <p className="hidden md:flex">
                Turista{" "}
                <span className="pl-1 text-lightBlue">
                  ${dolar[6].casa.venta}
                </span>
              </p>
            </div>) : null
            
          
          }
            
           
            <button onClick={toggleNav} className="font-black cursor-pointer">
             {!open ? <> +MÁS</> : <> -MENOS</> }
            </button>
          </div>

          <div
            id="Menú-info-completa-cotización-dólar"
            className="absolute z-20 right-0 md:top-8 bg-darkBlue text-background w-4/5 md:w-1/4 rounded-b-xl"
            style={{ display: open ? "block" : "none" }}
          >
            <div className="flex flex-col m-2 text-center nav">
              <p className="uppercase underline text-sm text-background pt-2">Dólar oficial:</p>
              <div className="gap-4 text-center space-x-2">
                  <span className="text-sm">Compra</span>
                  <span className="text-lightBlue">
                    ${dolar[0].casa.compra} 
                  </span>
                  <span className="pl-2 text-sm">Venta</span>
                  <span className=" text-lightBlue">
                    ${dolar[0].casa.venta}
                  </span>
              </div>
              <p className="uppercase underline text-sm text-background pt-2">Dólar blue:</p>
              <div className="gap-4 text-center space-x-2">
                  <span className="text-sm">Compra</span>
                  <span className="text-lightBlue">
                    ${dolar[1].casa.compra}
                  </span>
                  <span className="pl-2 text-sm">Venta</span>
                  <span className=" text-lightBlue">
                    ${dolar[1].casa.venta}
                  </span>
              </div>
              <p className="uppercase underline text-sm text-background pt-2">Dólar turista:</p>
              <div className="gap-4 text-center space-x-2">
                  
                  <span className="text-sm">Venta</span>
                  <span className=" text-lightBlue">
                    ${dolar[6].casa.venta}
                  </span>
              </div>
              <p className="uppercase underline text-sm text-background pt-2">Bitcoin:</p>
              <div className="gap-4 text-center space-x-2">
                  
                  <span className="text-sm">Compra</span>
                  <span className=" text-lightBlue">
                    ${dolar[5].casa.compra}
                  </span>
              </div>
              <p className="uppercase underline text-sm text-background pt-2">Riesgo País:</p>
              <div className="gap-4 text-center space-x-2">
                  
                  
                  <span className=" text-lightBlue">
                    {dolar[8].casa.compra}
                  </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Nav;

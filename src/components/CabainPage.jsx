import { useParams, Link } from "react-router-dom";

const CabainPage = ({ cabains }) => {
  //useParams permite recuperar parametros de la url
  const { cabainId } = useParams();

  const item = cabains.filter((item) => item.id == cabainId)[0];
  console.log(item);

  
  return (
    <div className="text-lightBlue w-4/5 mx-auto text-center space-y-6">
      <h1 className="m-8 text-4xl uppercase">{item.name}</h1>

      <div className="text-lg space-y-6">
          <img
            src={item.src}
            alt="cabaña mendoza alquiler casa fin de semana"
            className="mx-auto shadow-md border-2 h-80 w-96" 
          />
          <p className="p-6 pb-4 h-40 ">{item.description}</p>

          <p className="p-4 w-96 mx-auto font-extrabold shadow-md shadow-middleBlue bg-darkBlue text-background text-2xl rounded-lg cursor-pointer">Ver más de fotos</p>
         
          <div>
            <p className="uppercase text-lg text-middleBlue mt-16">Número de teléfono:</p>
            <span className="text-2xl m-3">{item.phone}</span>
          </div>
          <div>
            <p className="uppercase text-lg text-middleBlue ">Correo electrónico:</p>
            <span className="text-2xl m-3">{item.mail}</span>
          </div>
          <div>
            <p className="uppercase text-lg text-middleBlue ">Precio por día:</p>
            <span className="text-2xl m-3">${item.price}</span>
          </div>
      </div>

      <Link to="/"><button className="p-4 mt-16 bg-darkBlue text-background font-extrabold shadow-lightBlue inner-shadow-md text-2xl rounded-lg uppercase">Volver</button></Link>


    </div>
  );
};

export default CabainPage;

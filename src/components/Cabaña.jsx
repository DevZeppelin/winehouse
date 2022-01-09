import React from "react";

function Cabaña({ name, description, price }) {
  return (
    <div className="cabaña text-center space-y-2 mt-4 m-2 p-4 border-2 border-darkBlue rounded-lg cursor-pointer hover:bg-darkBlue hover:text-background hover:font-extrabold">
      <div>
        <h2 className="text-lg font-extrabold uppercase max-h-8 overflow-hidden">{name}</h2>
        <img
          src="/example.jpg"
          alt="cabaña mendoza alquiler casa fin de semana"
          className="mx-auto shadow-md border-2"
        />
        <p className='p-2 pb-4 h-28'>{description}</p>
      </div>
      <div>
        <p className="uppercase text-sm ">Precio por día:</p>
        <span className="text-xl m-3">${price}</span>
      </div>
      <style jsx>{`
        .cabaña:hover {
          background-image: linear-gradient(
            -360deg,
            #35858B 0%, 
            #4FBDBA 50%,
            #35858B 100%
          );
        }
      `}</style>
    </div>
  );
}

export default Cabaña;

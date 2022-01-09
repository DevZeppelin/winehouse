import React from "react";

function Cabaña({ name, description, price, src }) {
  return (
    <div className="cabaña text-center space-y-2 mt-4 m-2 p-4 border-2 border-darkBlue rounded-lg cursor-pointer hover:bg-darkBlue hover:text-background hover:font-extrabold">
      <div>
        <h2 className="text-lg font-extrabold uppercase max-h-8 overflow-hidden">{name}</h2>
        <img
          src={src}
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
            -180deg,
            #AEFEFF 0%, 
            #4FBDBA 30%,
            #35858B 100%
          );
        }
      `}</style>
    </div>
  );
}

export default Cabaña;

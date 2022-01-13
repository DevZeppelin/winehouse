import React from "react";
import { BiWine } from "react-icons/bi";


const Header = () => {
  return (
    <header className="w-full pt-32 text-center pb-12 text-middleBlue ">
      <div className="flex justify-center w-32 mx-auto">
        <BiWine className="mx-auto text-6xl m-2" />
       
      </div>
      <h1 className="text-5xl font-bold  mb-4 uppercase text-lightBlue ">
        Cabañas Mendoza
      </h1>
      
      <h2 className="nav text-2xl mb-16 mt-4 animate-pulse mx-4">
        Tu descanso merece un lugar perfecto
      </h2>
      
    </header>
  );
};

export default Header;

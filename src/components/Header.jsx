import React from "react";
import { BiWine } from "react-icons/bi";

const Header = () => {
  return (
    <header className="w-full pt-32 text-center pb-12 text-middleBlue ">
      <BiWine className="mx-auto text-6xl m-4" />
      <h1 className="text-5xl font-bold  mb-4 uppercase text-lightBlue ">
        Winehouse
      </h1>
      <p className="text-2xl mb-16 animate-pulse">
        Tu descanso en Mendoza merece un lugar perfecto{" "}
      </p>
      
    </header>
  );
};

export default Header;

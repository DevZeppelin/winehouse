import React from "react";

const Header = () => {
  return (
    <header className="w-full pt-16 text-center pb-12 text-middleBlue ">
      <div className="flex justify-center mx-auto w-48 md:w-auto">
        <img
          src="/logo.png"
          alt="logo winehouse cabañas mendoza"
          className="logo-animation"
        />
      </div>
    </header>
  );
};

export default Header;

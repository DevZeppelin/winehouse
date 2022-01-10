import React from "react";

const Footer = () => {
  return (
    <div className="mt-16 m-4 text-darkBlue text-center">
      <span className="text-center">
        Web desarrollada por{" "}
        <a href="https://www.devzeppelin.ar" target="_blank" className="font-bold text-lightBlue">
          DevZeppelin
        </a>
        . Todos los derechos reservados. {new Date().getFullYear()}{" "}
      </span>
    </div>
  );
};

export default Footer;

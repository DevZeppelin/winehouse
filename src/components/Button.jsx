import React from "react";

const Button = () => {
  return (
    <div className="text-center pb-24 nav">
      <a href="#main">
        <button className="button p-4 bg-middleBlue font-bold rounded-lg text-lg border-2 border-darkBlue hover:bg-background hover:border-lightBlue hover:text-middleBlue uppercase">
          Ver cabañas
        </button>
      </a>
    </div>
  );
};

export default Button;

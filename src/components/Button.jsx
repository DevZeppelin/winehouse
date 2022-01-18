import React from "react";

const Button = () => {
  return (
    <div className="text-center pb-24">
      <a href="#main">
        <button className="button p-2 px-4 bg-middleBlue font-bold rounded-lg text-lg border-2 border-darkBlue hover:bg-orange hover:border-lightBlue hover:text-background">
          Ver cabañas
        </button>
      </a>
    </div>
  );
};

export default Button;

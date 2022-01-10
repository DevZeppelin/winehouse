import Cabain from "./Cabain"


const Main = ({cabains}) => {
    return (
        <main id="main" className="text-lightBlue w-4/5 mx-auto">
           
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
          {cabains.map(cabain => (
            <Cabain
              key={cabain.id}
              id={cabain.id}
              name={cabain.name}
              description={cabain.description}
              price={cabain.price}
              src={cabain.src}
            />
          ))}          
        </div>
      </main>
    )
}

export default Main

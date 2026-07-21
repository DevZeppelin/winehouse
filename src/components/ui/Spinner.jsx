const Spinner = ({ className = "" }) => (
  <div
    className={`h-8 w-8 rounded-full border-2 border-middleBlue/30 border-t-lightBlue animate-spin ${className}`}
    role="status"
    aria-label="Cargando"
  />
);

export default Spinner;

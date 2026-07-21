const STEPS = ["Datos", "Comodidades", "Fotos", "Plan y pago"];

const StepIndicator = ({ step }) => (
  <div className="mb-8 flex items-center justify-center gap-2">
    {STEPS.map((label, i) => {
      const n = i + 1;
      const active = n === step;
      const done = n < step;
      return (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black transition-colors ${
              active
                ? "border-orange bg-orange text-background"
                : done
                ? "border-darkBlue bg-darkBlue text-background"
                : "border-surfaceBorder text-middleBlue"
            }`}
          >
            {n}
          </div>
          <span className={`hidden text-xs font-bold uppercase sm:block ${active ? "text-lightBlue" : "text-middleBlue"}`}>
            {label}
          </span>
          {n < STEPS.length && <div className="h-0.5 w-6 bg-surfaceBorder sm:w-10" />}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;

const RegionFilter = ({ regions, region, onRegionChange }) => {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onRegionChange("")}
        className={`shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors ${
          region === ""
            ? "border-orange bg-orange text-background"
            : "border-darkBlue text-middleBlue hover:border-lightBlue hover:text-lightBlue"
        }`}
      >
        Todas
      </button>
      {regions.map((r) => (
        <button
          key={r.id}
          onClick={() => onRegionChange(r.slug)}
          className={`shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors ${
            region === r.slug
              ? "border-orange bg-orange text-background"
              : "border-darkBlue text-middleBlue hover:border-lightBlue hover:text-lightBlue"
          }`}
        >
          {r.name}
        </button>
      ))}
    </div>
  );
};

export default RegionFilter;

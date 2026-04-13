const EmptyState = ({ title = "Your journey starts here!", description = "Start solving to build momentum." }) => {
  return (
    <div className="glass-card p-8 text-center">
      <svg
        className="mx-auto mb-4 h-20 w-20 text-cyan-300"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 19V5C4 4.44772 4.44772 4 5 4H14L20 10V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M14 4V10H20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 16H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-slate-300">{description}</p>
    </div>
  );
};

export default EmptyState;

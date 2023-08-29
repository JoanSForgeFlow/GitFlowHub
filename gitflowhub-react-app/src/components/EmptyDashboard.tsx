const EmptyDashboard = (bgColor) => {
  return (
    <div className={`empty-board-icon h-60 mt-1 bg-${bgColor} flex items-center justify-center border border-hidden rounded-b-md`}>
      <div>
        <span className="material-symbols-outlined text-5xl mr-2">
          empty_dashboard
        </span>
      </div>

      <div>Drag Your Pull Requests here</div>
    </div>
  );
};

export default EmptyDashboard;

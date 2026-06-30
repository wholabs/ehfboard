function Topbar({
  mode,
  projectName,
  saveStatus,
  onProjectNameChange,
  onSave,
  onExport,
  onImport,
  onReset,
  onMainAction,
  mainActionLabel,
  sidebarVisible,
  onToggleSidebar,
}) {
  return (
    <header className="flex h-14 shrink-0 flex-col gap-3 border-b border-slate-300 bg-slate-100 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded p-1 text-slate-700 hover:bg-slate-200 transition-colors"
          title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-900 border border-blue-200">
          {mode}
        </span>
        <input
          value={projectName}
          onChange={(event) => onProjectNameChange(event.target.value)}
          className="rounded border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-400 focus:bg-white"
        />
        <span
          className={`rounded-[4px] px-2 py-0.5 text-[10px] font-medium border ${
            saveStatus === "Saving..."
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {saveStatus}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          className="top-btn border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
        >
          Save
        </button>
        <div className="h-4 w-px bg-slate-300 mx-1"></div>
        <button type="button" onClick={onExport} className="top-btn">
          Export JSON
        </button>
        <label className="top-btn cursor-pointer">
          Import JSON
          <input
            type="file"
            accept="application/json"
            onChange={onImport}
            className="hidden"
          />
        </label>
        <div className="h-4 w-px bg-slate-300 mx-1"></div>
        <button type="button" onClick={onMainAction} className="top-btn">
          {mainActionLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="top-btn border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
        >
          Reset
        </button>
      </div>
    </header>
  );
}

export default Topbar;

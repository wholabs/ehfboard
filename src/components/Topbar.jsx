import { useState, useCallback } from "react";

function Dropdown({ label, icon, items, align = "right" }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="top-btn gap-1"
      >
        {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
        <span>{label}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className={`absolute top-full ${align === "right" ? "right-0" : "left-0"} mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-30 min-w-[150px] overflow-hidden`}>
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); item.action(); close(); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 ${i > 0 ? "border-t border-slate-100 dark:border-slate-600" : ""}`}
            >
              {item.icon && <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  isDark,
  onToggleDark,
  isFullscreen,
  onToggleFullscreen,
  onExportImage,
}) {
  const showExportImage = mode === "flowchart" || mode === "erd";

  const fileIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );

  const editIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const pngIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const svgIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );

  const saveIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );

  const jsonIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );

  const importIcon = (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );

  const fileItems = [
    { label: "Save", icon: saveIcon, action: onSave },
    { label: "Export JSON", icon: jsonIcon, action: onExport },
    { label: "Import JSON", icon: importIcon, action: () => document.getElementById("import-input")?.click() },
  ];

  const editItems = [
    { label: mainActionLabel, icon: editIcon, action: onMainAction },
    { label: "Reset", icon: null, action: onReset },
  ];

  const exportItems = [
    { label: "Export PNG", icon: pngIcon, action: () => onExportImage("png") },
    { label: "Export SVG", icon: svgIcon, action: () => onExportImage("svg") },
  ];

  return (
    <header className="flex h-14 shrink-0 flex-col gap-3 border-b border-slate-300 bg-slate-100 px-4 py-2 lg:flex-row lg:items-center lg:justify-between dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded p-1 text-slate-700 hover:bg-slate-200 transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
          title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-900 border border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700">
          {mode}
        </span>
        <input
          value={projectName}
          onChange={(event) => onProjectNameChange(event.target.value)}
          className="rounded border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-400 focus:bg-white dark:text-slate-200 dark:focus:bg-slate-700 dark:hover:border-slate-600"
        />
        <span
          className={`rounded-[4px] px-2 py-0.5 text-[10px] font-medium border ${
            saveStatus === "Saving..."
              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
          }`}
        >
          {saveStatus}
        </span>
      </div>

      <input id="import-input" type="file" accept="application/json" onChange={onImport} className="hidden" />

      <div className="flex flex-wrap items-center gap-2">
        <Dropdown label="File" icon={fileIcon} items={fileItems} />
        {showExportImage && <Dropdown label="Export" items={exportItems} />}
        <Dropdown label="Edit" icon={editIcon} items={editItems} />
        <div className="h-4 w-px bg-slate-300 mx-1 dark:bg-slate-600"></div>
        <button
          type="button"
          onClick={onToggleDark}
          className="top-btn px-2"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="top-btn px-2"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Topbar;

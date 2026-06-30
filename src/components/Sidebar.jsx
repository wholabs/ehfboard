const modeItems = [
  { id: "whiteboard", label: "Whiteboard" },
  { id: "flowchart", label: "Flowchart" },
  { id: "erd", label: "ERD" },
];

function Sidebar({ mode, onModeChange, onAddFlowNode, onAddErdTable }) {
  return (
    <aside className="border-r border-slate-300 bg-slate-50 flex h-full w-[200px] flex-col p-2 shrink-0 overflow-y-auto">
      <div className="h-14 flex items-center justify-center px-2 mb-4 rounded-md bg-[#0B1E3C]">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          EHF Workspace
        </h1>
      </div>

      <div className="space-y-1">
        {modeItems.map((item) => {
          const isActive = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
              className={`w-full rounded-[4px] px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-900 border border-blue-200"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-300 pt-3 px-2 flex-1 overflow-y-auto">
        {mode === "whiteboard" && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Use tldraw tools in canvas →
          </p>
        )}

        {mode === "flowchart" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Flow Tools
            </p>
            <div className="grid gap-1.5">
              <button
                type="button"
                onClick={() => onAddFlowNode("process")}
                className="top-btn justify-start"
              >
                + Process
              </button>
              <button
                type="button"
                onClick={() => onAddFlowNode("decision")}
                className="top-btn justify-start"
              >
                + Decision
              </button>
              <button
                type="button"
                onClick={() => onAddFlowNode("startEnd")}
                className="top-btn justify-start"
              >
                + Start/End
              </button>
              <button
                type="button"
                onClick={() => onAddFlowNode("data")}
                className="top-btn justify-start"
              >
                + Data
              </button>
              <button
                type="button"
                onClick={() => onAddFlowNode("io")}
                className="top-btn justify-start"
              >
                + Input/Output
              </button>
            </div>
          </>
        )}

        {mode === "erd" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              ERD Tools
            </p>
            <div className="grid gap-1.5">
              <button
                type="button"
                onClick={onAddErdTable}
                className="top-btn justify-start"
              >
                + Add Table
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

import { Handle, Position } from "reactflow";
import { useState } from "react";

const kindStyleMap = {
  process: "bg-blue-100 border-blue-300",
  data: "bg-purple-100 border-purple-300",
  io: "bg-orange-100 border-orange-300",
  decision: "bg-sky-100 border-sky-300",
  merge: "bg-pink-100 border-pink-300",
  startEnd: "bg-emerald-100 border-emerald-300",
};

const colorOptions = [
  { name: "Blue", bg: "bg-blue-100", border: "border-blue-300" },
  { name: "Purple", bg: "bg-purple-100", border: "border-purple-300" },
  { name: "Orange", bg: "bg-orange-100", border: "border-orange-300" },
  { name: "Red", bg: "bg-red-100", border: "border-red-300" },
  { name: "Green", bg: "bg-green-100", border: "border-green-300" },
  { name: "Cyan", bg: "bg-cyan-100", border: "border-cyan-300" },
];

function FlowNode({ id, data, isConnectable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);

  const getMappedColor = () => {
    if (data.color) {
      const option = colorOptions.find(
        (opt) => opt.name.toLowerCase() === data.color.toLowerCase(),
      );
      if (option) return option;
    }
    const kindClass = kindStyleMap[data.kind];
    if (kindClass) {
      return {
        bg: kindClass.split(" ")[0],
        border: kindClass.split(" ")[1],
      };
    }
    return colorOptions[0];
  };

  const currentColor = getMappedColor();
  const kindClass = `${currentColor.bg} ${currentColor.border}`;

  return (
    <div
      className={`min-w-[170px] rounded-xl border-2 px-3 py-2 shadow-md transition-all ${kindClass}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-blue-700"
      />

      {isEditing ? (
        <input
          autoFocus
          className="w-full bg-transparent text-center text-xs font-semibold text-slate-700 outline-none border-b border-slate-400"
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={() => {
            data.onLabelChange?.(id, tempLabel);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              data.onLabelChange?.(id, tempLabel);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <div className="text-center text-xs font-semibold text-slate-700">
          {data.label}
        </div>
      )}

      <div className="mt-1 text-center text-[9px] uppercase tracking-[0.15em] text-slate-500 font-medium">
        {data.kind}
      </div>

      {showColorPicker && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-lg p-2 shadow-lg z-10 grid grid-cols-3 gap-1">
          {colorOptions.map((option) => (
            <button
              key={option.name}
              className={`${option.bg} ${option.border} border-2 rounded px-2 py-1 text-[8px] font-bold hover:shadow-md transition-all`}
              onClick={() => {
                data.onColorChange?.(id, option.name.toLowerCase());
                setShowColorPicker(false);
              }}
              title={option.name}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="mt-1 w-full text-[9px] px-1 py-0.5 bg-slate-200 hover:bg-slate-300 rounded transition-colors font-semibold"
      >
        Color
      </button>

      {data.onDuplicate && (
        <button
          onClick={() => data.onDuplicate(id)}
          className="mt-1 w-full text-[9px] px-1 py-0.5 bg-blue-200 hover:bg-blue-300 rounded transition-colors font-semibold"
        >
          Duplicate
        </button>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-blue-700"
      />
    </div>
  );
}

export default FlowNode;

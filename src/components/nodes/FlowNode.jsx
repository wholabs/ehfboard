import { Handle, Position } from "reactflow";
import { useState } from "react";

const kindShapeMap = {
  process: "rectangle",
  data: "parallelogram",
  io: "trapezoid",
  decision: "diamond",
  merge: "diamond",
  startEnd: "rounded-rectangle",
};

// Utility function to parse hex color
const getColorStyles = (hexColor) => {
  const hex = hexColor || "#3b82f6"; // default blue
  // Extract RGB from hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Calculate luminance for text color (light or dark)
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = luminance > 128 ? "#000000" : "#FFFFFF";
  // Create light background by blending with white
  const lightHex = `rgba(${r}, ${g}, ${b}, 0.15)`;
  return { bgColor: lightHex, borderColor: hex, textColor };
};

function FlowNode({ id, data, isConnectable, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempHexColor, setTempHexColor] = useState(data.color || "#3b82f6");

  const hexColor = data.color || "#3b82f6";
  const styles = getColorStyles(hexColor);
  const shape = kindShapeMap[data.kind] || "rectangle";

  const handleLabelSave = () => {
    data.onLabelChange?.(id, tempLabel);
    setIsEditing(false);
  };

  const handleDuplicate = () => {
    data.onDuplicate?.(id);
    setShowMenu(false);
  };

  const handleColorChange = (newColor) => {
    data.onColorChange?.(id, newColor);
    setTempHexColor(newColor);
    setShowColorPicker(false);
    setShowMenu(false);
  };

  const presetColors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f97316", // orange
    "#ef4444", // red
    "#10b981", // green
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#f59e0b", // amber
    "#14b8a6", // teal
    "#6366f1", // indigo
  ];

  // Rectangle shape (process)
  if (shape === "rectangle") {
    return (
      <div
        className={`relative min-w-[160px] px-4 py-3 rounded-lg border-2 shadow-md transition-all cursor-pointer group ${
          selected ? "ring-2 ring-blue-500 shadow-lg" : ""
        }`}
        style={{
          backgroundColor: styles.bgColor,
          borderColor: styles.borderColor,
        }}
        onDoubleClick={() => setIsEditing(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />

        {isEditing ? (
          <input
            autoFocus
            className="w-full text-center text-sm font-semibold outline-none bg-transparent border-b-2"
            style={{ borderColor: styles.borderColor, color: styles.textColor }}
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleLabelSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLabelSave();
            }}
          />
        ) : (
          <div
            className="text-center text-sm font-semibold"
            style={{ color: styles.textColor }}
          >
            {data.label}
          </div>
        )}

        {showMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 min-w-max">
            <div className="p-3 space-y-3 min-w-[200px]">
              <div>
                <div className="text-[10px] font-bold text-slate-600 mb-2">
                  Color
                </div>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {presetColors.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {presetColors.slice(5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full text-[10px] font-semibold px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    {showColorPicker ? "Hide" : "Custom"}
                  </button>
                  {showColorPicker && (
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="w-10 h-8 cursor-pointer rounded"
                      />
                      <input
                        type="text"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="flex-1 px-2 text-[10px] border border-slate-300 rounded"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => handleColorChange(tempHexColor)}
                        className="px-2 py-1 text-[10px] font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDuplicate}
                className="w-full px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Duplicate
              </button>
            </div>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    );
  }

  // Diamond shape (decision, merge)
  if (shape === "diamond") {
    return (
      <div
        className={`relative transition-all cursor-pointer group ${
          selected ? "ring-2 ring-blue-500 shadow-lg" : ""
        }`}
        onDoubleClick={() => setIsEditing(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
        style={{
          width: "140px",
          height: "140px",
        }}
      >
        <div
          className="w-full h-full transform rotate-45 border-2 shadow-md flex items-center justify-center"
          style={{
            backgroundColor: styles.bgColor,
            borderColor: styles.borderColor,
          }}
        >
          <div className="transform -rotate-45 text-center px-2">
            {isEditing ? (
              <input
                autoFocus
                className="w-full text-center text-xs font-semibold outline-none bg-transparent border-b-2"
                style={{
                  borderColor: styles.borderColor,
                  color: styles.textColor,
                }}
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onBlur={handleLabelSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLabelSave();
                }}
              />
            ) : (
              <div
                className="text-xs font-semibold"
                style={{ color: styles.textColor }}
              >
                {data.label}
              </div>
            )}
          </div>
        </div>

        {showMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 min-w-max">
            <div className="p-3 space-y-3 min-w-[200px]">
              <div>
                <div className="text-[10px] font-bold text-slate-600 mb-2">
                  Color
                </div>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {presetColors.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {presetColors.slice(5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full text-[10px] font-semibold px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    {showColorPicker ? "Hide" : "Custom"}
                  </button>
                  {showColorPicker && (
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="w-10 h-8 cursor-pointer rounded"
                      />
                      <input
                        type="text"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="flex-1 px-2 text-[10px] border border-slate-300 rounded"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => handleColorChange(tempHexColor)}
                        className="px-2 py-1 text-[10px] font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDuplicate}
                className="w-full px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Duplicate
              </button>
            </div>
          </div>
        )}

        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{
            left: "50%",
            top: "-8px",
            transform: "translateX(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{
            left: "50%",
            bottom: "-8px",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    );
  }

  // Rounded rectangle (start/end)
  if (shape === "rounded-rectangle") {
    return (
      <div
        className={`relative min-w-[160px] px-4 py-3 rounded-full border-2 shadow-md transition-all cursor-pointer group ${
          selected ? "ring-2 ring-blue-500 shadow-lg" : ""
        }`}
        style={{
          backgroundColor: styles.bgColor,
          borderColor: styles.borderColor,
        }}
        onDoubleClick={() => setIsEditing(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />

        {isEditing ? (
          <input
            autoFocus
            className="w-full text-center text-sm font-semibold outline-none bg-transparent border-b-2"
            style={{ borderColor: styles.borderColor, color: styles.textColor }}
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleLabelSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLabelSave();
            }}
          />
        ) : (
          <div
            className="text-center text-sm font-semibold"
            style={{ color: styles.textColor }}
          >
            {data.label}
          </div>
        )}

        {showMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 min-w-max">
            <div className="p-3 space-y-3 min-w-[200px]">
              <div>
                <div className="text-[10px] font-bold text-slate-600 mb-2">
                  Color
                </div>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {presetColors.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {presetColors.slice(5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full text-[10px] font-semibold px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    {showColorPicker ? "Hide" : "Custom"}
                  </button>
                  {showColorPicker && (
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="w-10 h-8 cursor-pointer rounded"
                      />
                      <input
                        type="text"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="flex-1 px-2 text-[10px] border border-slate-300 rounded"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => handleColorChange(tempHexColor)}
                        className="px-2 py-1 text-[10px] font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDuplicate}
                className="w-full px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Duplicate
              </button>
            </div>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    );
  }

  // Parallelogram shape (data)
  if (shape === "parallelogram") {
    return (
      <div
        className={`relative transition-all cursor-pointer group ${
          selected ? "ring-2 ring-blue-500 shadow-lg" : ""
        }`}
        style={{
          width: "140px",
          height: "80px",
        }}
        onDoubleClick={() => setIsEditing(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
      >
        <div
          className="w-full h-full border-2 shadow-md flex items-center justify-center"
          style={{
            backgroundColor: styles.bgColor,
            borderColor: styles.borderColor,
            transform: "skewX(-20deg)",
          }}
        >
          <div
            style={{
              transform: "skewX(20deg)",
              textAlign: "center",
              padding: "0 8px",
            }}
          >
            {isEditing ? (
              <input
                autoFocus
                className="w-full text-center text-xs font-semibold outline-none bg-transparent border-b-2"
                style={{
                  borderColor: styles.borderColor,
                  color: styles.textColor,
                }}
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onBlur={handleLabelSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLabelSave();
                }}
              />
            ) : (
              <div
                className="text-xs font-semibold"
                style={{ color: styles.textColor }}
              >
                {data.label}
              </div>
            )}
          </div>
        </div>

        {showMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 min-w-max">
            <div className="p-3 space-y-3 min-w-[200px]">
              <div>
                <div className="text-[10px] font-bold text-slate-600 mb-2">
                  Color
                </div>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {presetColors.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {presetColors.slice(5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full text-[10px] font-semibold px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    {showColorPicker ? "Hide" : "Custom"}
                  </button>
                  {showColorPicker && (
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="w-10 h-8 cursor-pointer rounded"
                      />
                      <input
                        type="text"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="flex-1 px-2 text-[10px] border border-slate-300 rounded"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => handleColorChange(tempHexColor)}
                        className="px-2 py-1 text-[10px] font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDuplicate}
                className="w-full px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Duplicate
              </button>
            </div>
          </div>
        )}

        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    );
  }

  // Trapezoid shape (input/output)
  if (shape === "trapezoid") {
    return (
      <div
        className={`relative transition-all cursor-pointer group ${
          selected ? "ring-2 ring-blue-500 shadow-lg" : ""
        }`}
        style={{
          width: "140px",
          height: "80px",
        }}
        onDoubleClick={() => setIsEditing(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
      >
        <div
          className="w-full h-full border-2 shadow-md flex items-center justify-center"
          style={{
            backgroundColor: styles.bgColor,
            borderColor: styles.borderColor,
            clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <div style={{ textAlign: "center", padding: "0 8px" }}>
            {isEditing ? (
              <input
                autoFocus
                className="w-full text-center text-xs font-semibold outline-none bg-transparent border-b-2"
                style={{
                  borderColor: styles.borderColor,
                  color: styles.textColor,
                }}
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onBlur={handleLabelSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLabelSave();
                }}
              />
            ) : (
              <div
                className="text-xs font-semibold"
                style={{ color: styles.textColor }}
              >
                {data.label}
              </div>
            )}
          </div>
        </div>

        {showMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 min-w-max">
            <div className="p-3 space-y-3 min-w-[200px]">
              <div>
                <div className="text-[10px] font-bold text-slate-600 mb-2">
                  Color
                </div>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {presetColors.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {presetColors.slice(5).map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: hexColor === color ? "#0000ff" : color,
                          borderWidth: hexColor === color ? "3px" : "2px",
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full text-[10px] font-semibold px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    {showColorPicker ? "Hide" : "Custom"}
                  </button>
                  {showColorPicker && (
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="w-10 h-8 cursor-pointer rounded"
                      />
                      <input
                        type="text"
                        value={tempHexColor}
                        onChange={(e) => setTempHexColor(e.target.value)}
                        className="flex-1 px-2 text-[10px] border border-slate-300 rounded"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => handleColorChange(tempHexColor)}
                        className="px-2 py-1 text-[10px] font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDuplicate}
                className="w-full px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Duplicate
              </button>
            </div>
          </div>
        )}

        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    );
  }

  // Default fallback rectangle
  return (
    <div
      className={`relative min-w-[160px] px-4 py-3 rounded-lg border-2 shadow-md transition-all cursor-pointer group ${
        selected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      style={{
        backgroundColor: styles.bgColor,
        borderColor: styles.borderColor,
      }}
      onDoubleClick={() => setIsEditing(true)}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(!showMenu);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      {isEditing ? (
        <input
          autoFocus
          className="w-full text-center text-sm font-semibold outline-none bg-transparent border-b-2 border-blue-400"
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={handleLabelSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLabelSave();
          }}
        />
      ) : (
        <div
          className="text-center text-sm font-semibold"
          style={{ color: styles.textColor }}
        >
          {data.label}
        </div>
      )}

      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-20 min-w-max">
          <div className="p-3 space-y-3 min-w-[200px]">
            <div>
              <div className="text-[10px] font-bold text-slate-600 mb-2">
                Color
              </div>
              <div className="space-y-2">
                <div className="flex gap-1">
                  {presetColors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: hexColor === color ? "#0000ff" : color,
                        borderWidth: hexColor === color ? "3px" : "2px",
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  {presetColors.slice(5).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded border-2"
                      style={{
                        backgroundColor: color,
                        borderColor: hexColor === color ? "#0000ff" : color,
                        borderWidth: hexColor === color ? "3px" : "2px",
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full text-[10px] font-semibold px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
                >
                  {showColorPicker ? "Hide" : "Custom"}
                </button>
                {showColorPicker && (
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={tempHexColor}
                      onChange={(e) => setTempHexColor(e.target.value)}
                      className="w-10 h-8 cursor-pointer rounded"
                    />
                    <input
                      type="text"
                      value={tempHexColor}
                      onChange={(e) => setTempHexColor(e.target.value)}
                      className="flex-1 px-2 text-[10px] border border-slate-300 rounded"
                      placeholder="#000000"
                    />
                    <button
                      onClick={() => handleColorChange(tempHexColor)}
                      className="px-2 py-1 text-[10px] font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      OK
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleDuplicate}
              className="w-full px-2 py-1 text-[10px] font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Duplicate
            </button>
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default FlowNode;

import { useState } from "react";

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
const fontStyles = [
  { name: "Regular", style: "normal" },
  { name: "Bold", style: "bold" },
  { name: "Italic", style: "italic" },
  { name: "Bold Italic", style: "bold-italic" },
];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Orange", hex: "#F97316" },
  { name: "Yellow", hex: "#FBBF24" },
  { name: "Green", hex: "#22C55E" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Cyan", hex: "#06B6D4" },
];

const fillColors = [
  { name: "No Fill", hex: "transparent" },
  { name: "Light Red", hex: "#FECACA" },
  { name: "Light Orange", hex: "#FDBA74" },
  { name: "Light Yellow", hex: "#FDE047" },
  { name: "Light Green", hex: "#BBF7D0" },
  { name: "Light Blue", hex: "#BFDBFE" },
  { name: "Light Purple", hex: "#E9D5FF" },
  { name: "Light Pink", hex: "#FBCFE8" },
  { name: "Light Gray", hex: "#F3F4F6" },
];

function WhiteboardTools() {
  const [selectedFontSize, setSelectedFontSize] = useState(16);
  const [selectedFontStyle, setSelectedFontStyle] = useState("normal");
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#000000");
  const [selectedFillColor, setSelectedFillColor] = useState("transparent");
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="space-y-3 text-sm">
      {/* Font Size Section */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "fontSize" ? null : "fontSize",
            )
          }
          className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center justify-between transition-colors"
        >
          <span>Font Size</span>
          <span className="text-xs text-slate-500">{selectedFontSize}px</span>
        </button>
        {expandedSection === "fontSize" && (
          <div className="p-2 grid grid-cols-3 gap-1 max-h-[200px] overflow-y-auto">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedFontSize(size)}
                className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                  selectedFontSize === size
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Style Section */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "fontStyle" ? null : "fontStyle",
            )
          }
          className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center justify-between transition-colors"
        >
          <span>Font Style</span>
          <span className="text-xs text-slate-500">{selectedFontStyle}</span>
        </button>
        {expandedSection === "fontStyle" && (
          <div className="p-2 space-y-1">
            {fontStyles.map((style) => (
              <button
                key={style.style}
                onClick={() => setSelectedFontStyle(style.style)}
                className={`w-full px-2 py-2 rounded text-sm font-medium transition-colors text-left ${
                  selectedFontStyle === style.style
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } ${
                  style.style === "bold" || style.style === "bold-italic"
                    ? "font-bold"
                    : style.style === "italic" || style.style === "bold-italic"
                      ? "italic"
                      : ""
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stroke Color Section */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "strokeColor" ? null : "strokeColor",
            )
          }
          className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center justify-between transition-colors"
        >
          <span>Stroke Color</span>
          <div
            className="w-6 h-6 rounded border-2 border-slate-300"
            style={{ backgroundColor: selectedStrokeColor }}
          />
        </button>
        {expandedSection === "strokeColor" && (
          <div className="p-2 grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSelectedStrokeColor(color.hex)}
                className={`w-full h-8 rounded border-2 transition-all ${
                  selectedStrokeColor === color.hex
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-slate-300"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fill Color Section */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "fillColor" ? null : "fillColor",
            )
          }
          className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center justify-between transition-colors"
        >
          <span>Fill Color</span>
          <div
            className="w-6 h-6 rounded border-2 border-slate-300"
            style={{
              backgroundColor: selectedFillColor,
              backgroundImage:
                selectedFillColor === "transparent"
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                  : "none",
              backgroundSize:
                selectedFillColor === "transparent" ? "8px 8px" : "auto",
              backgroundPosition:
                selectedFillColor === "transparent" ? "0 0, 4px 4px" : "auto",
            }}
          />
        </button>
        {expandedSection === "fillColor" && (
          <div className="p-2 grid grid-cols-3 gap-2">
            {fillColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSelectedFillColor(color.hex)}
                className={`w-full h-8 rounded border-2 transition-all ${
                  selectedFillColor === color.hex
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-slate-300"
                }`}
                style={{
                  backgroundColor: color.hex,
                  backgroundImage:
                    color.hex === "transparent"
                      ? "linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)"
                      : "none",
                  backgroundSize:
                    color.hex === "transparent" ? "6px 6px" : "auto",
                  backgroundPosition:
                    color.hex === "transparent" ? "0 0, 3px 3px" : "auto",
                }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
        <p className="font-semibold mb-1">Whiteboard Tips:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Use tldraw toolbar for shapes</li>
          <li>Drawing tools in main canvas</li>
          <li>Settings apply to new text</li>
        </ul>
      </div>
    </div>
  );
}

export default WhiteboardTools;

import { useEditor } from "@tldraw/tldraw";
import { useEffect, useState } from "react";

const fontFamilies = [
  { name: "Default", value: "default" },
  { name: "Monospace", value: "monospace" },
  { name: "Serif", value: "serif" },
  { name: "System UI", value: "system-ui" },
];

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

const fontWeights = [
  { name: "Light", value: 300 },
  { name: "Normal", value: 400 },
  { name: "Semi Bold", value: 600 },
  { name: "Bold", value: 700 },
];

function TextFormattingPanel() {
  const editor = useEditor();
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [isTextShape, setIsTextShape] = useState(false);
  const [currentProps, setCurrentProps] = useState({
    size: 16,
    weight: 400,
    family: "default",
    color: "#000000",
  });

  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const shapes = editor
        .getSelectedShapeIds()
        .map((id) => editor.getShape(id))
        .filter((s) => s?.type === "text");

      setSelectedShapes(shapes);
      setIsTextShape(shapes.length > 0);

      if (shapes.length > 0) {
        const shape = shapes[0];
        setCurrentProps({
          size: shape.props?.size || 16,
          weight: shape.props?.weight || 400,
          family: shape.props?.family || "default",
          color: shape.props?.color || "#000000",
        });
      }
    };

    updateSelection();

    // Listen to selection changes
    const unsubscribe = editor.store.listen(updateSelection);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [editor]);

  const updateTextProperty = (property, value) => {
    if (selectedShapes.length === 0) return;

    selectedShapes.forEach((shape) => {
      editor.updateShape({
        id: shape.id,
        type: shape.type,
        props: {
          ...shape.props,
          [property]: value,
        },
      });
    });

    setCurrentProps((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  if (!isTextShape) {
    return (
      <div className="p-3 text-xs text-slate-500 text-center">
        Select text to format
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
          Font Family
        </label>
        <select
          value={currentProps.family}
          onChange={(e) => updateTextProperty("family", e.target.value)}
          className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
          Font Size: {currentProps.size}px
        </label>
        <div className="grid grid-cols-3 gap-1">
          {fontSizes.map((size) => (
            <button
              key={size}
              onClick={() => updateTextProperty("size", size)}
              className={`py-1 px-1.5 rounded text-[9px] font-semibold transition-colors ${
                currentProps.size === size
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
          Font Weight
        </label>
        <div className="grid grid-cols-2 gap-1">
          {fontWeights.map((weight) => (
            <button
              key={weight.value}
              onClick={() => updateTextProperty("weight", weight.value)}
              className={`py-1.5 rounded text-[9px] font-semibold transition-colors ${
                currentProps.weight === weight.value
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {weight.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
          Text Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={currentProps.color}
            onChange={(e) => updateTextProperty("color", e.target.value)}
            className="w-12 h-8 rounded cursor-pointer border border-slate-300"
          />
          <div className="text-xs text-slate-600 flex items-center">
            {currentProps.color}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <p className="text-[9px] text-slate-500 font-semibold">
          {selectedShapes.length} text shape
          {selectedShapes.length !== 1 ? "s" : ""} selected
        </p>
      </div>
    </div>
  );
}

export default TextFormattingPanel;

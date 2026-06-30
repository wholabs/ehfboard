import { useState, useCallback, useRef, useEffect } from "react";

const FORMATS = [
  { value: "dbml", label: "DBML" },
  { value: "sql", label: "SQL" },
];

const DBML_TEMPLATE = `Table users {
  id integer [pk]
  name varchar(255)
  email varchar(255)
  created_at timestamp
}

Table orders {
  id integer [pk]
  user_id integer
  total decimal(10,2)
  status varchar(50)
  created_at timestamp
}

Ref: orders.user_id > users.id
`;

const SQL_TEMPLATE = `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

function CodeGeneratorModal({ onClose, onGenerate }) {
  const [code, setCode] = useState(DBML_TEMPLATE);
  const [format, setFormat] = useState("dbml");
  const [generating, setGenerating] = useState(false);
  const [isMac] = useState(() => navigator.userAgent.includes("Mac"));
  const textareaRef = useRef(null);
  const lineNumRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [format]);

  const syncScroll = useCallback(() => {
    if (lineNumRef.current && textareaRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      document.getElementById("generate-btn")?.click();
    }
  }, []);

  const handleFormatChange = useCallback((newFormat) => {
    setFormat(newFormat);
    setCode(newFormat === "dbml" ? DBML_TEMPLATE : SQL_TEMPLATE);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!code.trim()) return;
    setGenerating(true);
    try {
      await onGenerate(code, format);
    } finally {
      setGenerating(false);
    }
  }, [code, format, onGenerate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Generate From Code
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Parse DBML or SQL schema into ERD tables
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Format selector */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Format
            </span>
            <div className="flex gap-1">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleFormatChange(f.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    format === f.value
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 flex flex-col bg-[#1e1e2e]">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#181825] border-b border-[#313244]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f38ba8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#fab387]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#a6e3a1]" />
              </div>
              <span className="text-[11px] text-[#6c7086] font-mono ml-3">
                {format === "sql" ? "schema.sql" : "schema.dbml"}
              </span>
            </div>
            <span className="text-[11px] text-[#6c7086] font-mono">
              {lineCount} lines
            </span>
          </div>

          {/* Editor body with line numbers */}
          <div className="flex-1 min-h-0 flex overflow-hidden">
            <div
              ref={lineNumRef}
              className="select-none overflow-hidden pt-3 pb-4 w-12 shrink-0 bg-[#181825] border-r border-[#313244]"
            >
              {lineNumbers.map((num) => (
                <div
                  key={num}
                  className="text-right pr-3 text-[11px] leading-[1.65] font-mono text-[#6c7086]"
                >
                  {num}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={syncScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              wrap="off"
              className="flex-1 min-h-0 resize-none border-0 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm leading-[1.65] p-3 outline-none placeholder-[#6c7086]"
              placeholder={format === "sql" ? "-- Enter SQL CREATE TABLE statements..." : "// Enter DBML schema..."}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-300">
              {isMac ? "⌘" : "Ctrl"}+Enter
            </kbd>
            <span>to generate</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-white dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-transparent"
            >
              Cancel
            </button>
            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={generating || !code.trim()}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              {generating ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeGeneratorModal;

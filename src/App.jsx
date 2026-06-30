import { useEffect, useRef, useState, useCallback } from "react";
import { toPng, toSvg } from "html-to-image";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FlowCanvas from "./components/FlowCanvas";
import WhiteboardCanvas from "./components/WhiteboardCanvas";
import ERDCanvas from "./components/ERDCanvas";
import { useStore } from "./hooks/useStore";
import { exportProjectAsJson, parseImportedProject } from "./utils/storage";
import { generateFromCode } from "./utils/erdGenerator";
import CodeGeneratorModal from "./components/CodeGeneratorModal";

function App() {
  const [whiteboardUndoToken, setWhiteboardUndoToken] = useState(0);
  const [whiteboardResetToken, setWhiteboardResetToken] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("ehf-dark") === "true");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const flowRef = useRef(null);
  const erdRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("ehf-dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const mode = useStore((state) => state.mode);
  const projectName = useStore((state) => state.projectName);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const exportImage = useCallback(async (format) => {
    const el = mode === "flowchart" ? flowRef.current : erdRef.current;
    if (!el) return;
    const fn = format === "svg" ? toSvg : toPng;
    const dataUrl = await fn(el, { backgroundColor: isDark ? "#0f172a" : "#ffffff" });
    const link = document.createElement("a");
    link.download = `${projectName || "canvas"}.${format}`;
    link.href = dataUrl;
    link.click();
  }, [mode, projectName, isDark]);
  const saveStatus = useStore((state) => state.saveStatus);
  const setMode = useStore((state) => state.setMode);
  const setProjectName = useStore((state) => state.setProjectName);
  const setSaveStatus = useStore((state) => state.setSaveStatus);
  const addFlowNode = useStore((state) => state.addFlowNode);
  const addErdTable = useStore((state) => state.addErdTable);
  const deleteSelectedFlowElements = useStore(
    (state) => state.deleteSelectedFlowElements,
  );
  const deleteSelectedErdElements = useStore(
    (state) => state.deleteSelectedErdElements,
  );
  const resetProjectByMode = useStore((state) => state.resetProjectByMode);
  const getProjectPayload = useStore((state) => state.getProjectPayload);
  const importProjectPayload = useStore((state) => state.importProjectPayload);
  const saveToStorage = useStore((state) => state.saveToStorage);
  const loadFromStorage = useStore((state) => state.loadFromStorage);
  const flowNodes = useStore((state) => state.flowNodes);
  const flowEdges = useStore((state) => state.flowEdges);
  const erdNodes = useStore((state) => state.erdNodes);
  const erdEdges = useStore((state) => state.erdEdges);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    setSaveStatus("Saving...");
    const timer = setTimeout(() => {
      saveToStorage();
      setSaveStatus("Saved");
    }, 600);

    return () => clearTimeout(timer);
  }, [
    flowNodes,
    flowEdges,
    erdNodes,
    erdEdges,
    projectName,
    mode,
    saveToStorage,
    setSaveStatus,
  ]);

  const handleExport = () => {
    const payload = getProjectPayload();
    exportProjectAsJson(payload);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const payload = parseImportedProject(content);
      importProjectPayload(payload);
      setSaveStatus("Saved");
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  };

  const handleGenerateFromCode = useCallback(async (code, format) => {
    try {
      const { errors, nodes: genNodes, edges: genEdges } = await generateFromCode(
        code,
        format,
        erdNodes,
      );

      if (errors.length > 0) {
        alert("Validation errors:\n" + errors.join("\n"));
        return;
      }

      if (genNodes.length === 0) {
        alert("No tables found in the provided code.");
        return;
      }

      for (const node of genNodes) {
        useStore.setState((state) => ({
          erdNodes: [...state.erdNodes, node],
        }));
      }
      for (const edge of genEdges) {
        useStore.setState((state) => ({
          erdEdges: [...state.erdEdges, edge],
        }));
      }

      setShowGenerator(false);
      setSaveStatus("Generated");
    } catch (error) {
      alert(`Generation failed: ${error.message}`);
    }
  }, [erdNodes, setSaveStatus]);

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset canvas and remove current progress?",
    );
    if (!confirmed) {
      return;
    }

    if (mode === "whiteboard") {
      setWhiteboardResetToken((value) => value + 1);
    } else {
      resetProjectByMode(mode);
    }

    saveToStorage();
  };

  const mainActionLabel = mode === "whiteboard" ? "Undo" : "Delete Selected";

  const handleMainAction = () => {
    if (mode === "whiteboard") {
      setWhiteboardUndoToken((value) => value + 1);
      return;
    }

    if (mode === "flowchart") {
      deleteSelectedFlowElements();
      return;
    }

    if (mode === "erd") {
      deleteSelectedErdElements();
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#ffffff] dark:bg-slate-900">
      {sidebarVisible && (
        <Sidebar
          mode={mode}
          onModeChange={setMode}
          onAddFlowNode={addFlowNode}
          onAddErdTable={addErdTable}
          onOpenGenerator={() => setShowGenerator(true)}
        />
      )}
      {showGenerator && (
        <CodeGeneratorModal
          onClose={() => setShowGenerator(false)}
          onGenerate={handleGenerateFromCode}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          mode={mode}
          projectName={projectName}
          saveStatus={saveStatus}
          onProjectNameChange={setProjectName}
          onSave={saveToStorage}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
          onMainAction={handleMainAction}
          mainActionLabel={mainActionLabel}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          isDark={isDark}
          onToggleDark={() => setIsDark((v) => !v)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onExportImage={exportImage}
        />

        <main className="flex-1 relative bg-white overflow-hidden dark:bg-slate-900">
          {mode === "whiteboard" && (
            <WhiteboardCanvas
              undoToken={whiteboardUndoToken}
              resetToken={whiteboardResetToken}
            />
          )}
          {mode === "flowchart" && <FlowCanvas canvasRef={flowRef} />}
          {mode === "erd" && <ERDCanvas canvasRef={erdRef} />}
        </main>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FlowCanvas from "./components/FlowCanvas";
import WhiteboardCanvas from "./components/WhiteboardCanvas";
import ERDCanvas from "./components/ERDCanvas";
import { useStore } from "./hooks/useStore";
import { exportProjectAsJson, parseImportedProject } from "./utils/storage";

function App() {
  const [whiteboardUndoToken, setWhiteboardUndoToken] = useState(0);
  const [whiteboardResetToken, setWhiteboardResetToken] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const mode = useStore((state) => state.mode);
  const projectName = useStore((state) => state.projectName);
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
    <div className="flex h-screen w-screen bg-[#ffffff]">
      {sidebarVisible && (
        <Sidebar
          mode={mode}
          onModeChange={setMode}
          onAddFlowNode={addFlowNode}
          onAddErdTable={addErdTable}
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
        />

        <main className="flex-1 relative bg-white overflow-hidden">
          {mode === "whiteboard" && (
            <WhiteboardCanvas
              undoToken={whiteboardUndoToken}
              resetToken={whiteboardResetToken}
            />
          )}
          {mode === "flowchart" && <FlowCanvas />}
          {mode === "erd" && <ERDCanvas />}
        </main>
      </div>
    </div>
  );
}

export default App;

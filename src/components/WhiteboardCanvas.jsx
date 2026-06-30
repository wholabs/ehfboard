import { useEffect, useRef } from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useStore } from "../hooks/useStore";

function WhiteboardCanvas({ resetToken, undoToken }) {
  const editorRef = useRef(null);
  const persistenceKey = useStore((state) => state.whiteboardPersistenceKey);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !undoToken) {
      return;
    }
    editor.undo();
  }, [undoToken]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !resetToken) {
      return;
    }
    const shapeIds = Array.from(editor.getCurrentPageShapeIds());
    if (shapeIds.length > 0) {
      editor.deleteShapes(shapeIds);
    }
  }, [resetToken]);

  return (
    <div className="h-full w-full relative bg-white">
      <Tldraw
        persistenceKey={persistenceKey}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}

export default WhiteboardCanvas;

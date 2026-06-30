import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { useStore } from "../hooks/useStore";
import ErdNode from "./nodes/ErdNode";
import { useMemo } from "react";

const nodeTypes = {
  erdNode: ErdNode,
};

function ERDCanvas() {
  const nodes = useStore((state) => state.erdNodes);
  const edges = useStore((state) => state.erdEdges);
  const onNodesChange = useStore((state) => state.onErdNodesChange);
  const onEdgesChange = useStore((state) => state.onErdEdgesChange);
  const onConnect = useStore((state) => state.onErdConnect);
  const updateErdTableName = useStore((state) => state.updateErdTableName);
  const addErdField = useStore((state) => state.addErdField);
  const updateErdField = useStore((state) => state.updateErdField);
  const deleteErdField = useStore((state) => state.deleteErdField);
  const duplicateErdNode = useStore((state) => state.duplicateErdNode);

  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onTableNameChange: updateErdTableName,
          onAddField: addErdField,
          onUpdateField: updateErdField,
          onDeleteField: deleteErdField,
          onDuplicate: duplicateErdNode,
        },
      })),
    [
      nodes,
      updateErdTableName,
      addErdField,
      updateErdField,
      deleteErdField,
      duplicateErdNode,
    ],
  );

  return (
    <div className="h-full w-full relative bg-white">
      <ReactFlow
        fitView
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap className="!bg-white/80" nodeColor="#1E3A8A" />
        <Controls />
        <Background
          variant={BackgroundVariant.Dots}
          color="#94a3b8"
          gap={20}
          size={1.2}
        />
      </ReactFlow>
    </div>
  );
}

export default ERDCanvas;

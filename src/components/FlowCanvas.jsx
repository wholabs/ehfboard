import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowNode from "./nodes/FlowNode";
import { useStore } from "../hooks/useStore";

const nodeTypes = {
  flowNode: FlowNode,
};

function FlowCanvas() {
  const nodes = useStore((state) => state.flowNodes);
  const edges = useStore((state) => state.flowEdges);
  const onNodesChange = useStore((state) => state.onFlowNodesChange);
  const onEdgesChange = useStore((state) => state.onFlowEdgesChange);
  const onConnect = useStore((state) => state.onFlowConnect);
  const updateNodeLabel = useStore((state) => state.updateFlowNodeLabel);
  const updateNodeColor = useStore((state) => state.updateFlowNodeColor);
  const duplicateFlowNode = useStore((state) => state.duplicateFlowNode);

  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: updateNodeLabel,
          onColorChange: updateNodeColor,
          onDuplicate: duplicateFlowNode,
        },
      })),
    [nodes, updateNodeLabel, updateNodeColor, duplicateFlowNode],
  );

  const edgesWithLabels = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        label: edge.label,
        labelBgStyle: { fill: "#fff", color: "#222" },
      })),
    [edges],
  );

  return (
    <div className="h-full w-full relative bg-white">
      <ReactFlow
        fitView
        nodes={nodesWithCallbacks}
        edges={edgesWithLabels}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[15, 15]}
        deleteKeyCode={["Delete", "Backspace"]}
      >
        <MiniMap
          className="!bg-white/80"
          nodeColor={(node) => {
            if (node.data.color) {
              const colorMap = {
                blue: "#93c5fd",
                purple: "#d8b4fe",
                orange: "#fed7aa",
                red: "#fca5a5",
                green: "#86efac",
                cyan: "#a5f3fc",
              };
              return colorMap[node.data.color] || "#93c5fd";
            }
            if (node.data.kind === "decision") return "#7dd3fc";
            if (node.data.kind === "startEnd") return "#6ee7b7";
            return "#93c5fd";
          }}
        />
        <Controls showZoom showFitView showInteractive />
        <Background
          color="#94a3b8"
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
        />
      </ReactFlow>
    </div>
  );
}

export default FlowCanvas;

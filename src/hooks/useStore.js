import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { loadProjectFromStorage, saveProjectToStorage } from "../utils/storage";

const DEFAULT_PROJECT_ID = "default-project";

const makeFlowNode = (
  kind,
  position = { x: 220, y: 180 },
  label = null,
  color = null,
) => ({
  id: uuidv4(),
  type: "flowNode",
  position,
  data: {
    label:
      label ||
      (kind === "process"
        ? "Process"
        : kind === "data"
          ? "Data"
          : kind === "io"
            ? "Input/Output"
            : kind === "decision"
              ? "Decision"
              : kind === "merge"
                ? "Merge"
                : "Start / End"),
    kind,
    color: color || null,
  },
});

const INITIAL_FLOW_NODES = [
  makeFlowNode("startEnd", { x: 140, y: 80 }),
  makeFlowNode("process", { x: 140, y: 220 }),
];

const INITIAL_FLOW_EDGES = [
  {
    id: uuidv4(),
    source: INITIAL_FLOW_NODES[0].id,
    target: INITIAL_FLOW_NODES[1].id,
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  },
];

const makeErdNode = (
  tableName = "users",
  position = { x: 180, y: 120 },
  fields = [
    { name: "id", type: "INTEGER", key: "PK" },
    { name: "name", type: "TEXT", key: "" },
    { name: "created_at", type: "DATETIME", key: "" },
  ],
) => ({
  id: uuidv4(),
  type: "erdNode",
  position,
  data: {
    tableName,
    fields,
  },
});

const INITIAL_ERD_NODES = [
  makeErdNode("users", { x: 130, y: 90 }),
  makeErdNode("orders", { x: 460, y: 210 }, [
    { name: "id", type: "INTEGER", key: "PK" },
    { name: "user_id", type: "INTEGER", key: "FK" },
    { name: "total", type: "DECIMAL", key: "" },
  ]),
];

const INITIAL_ERD_EDGES = [
  {
    id: uuidv4(),
    source: INITIAL_ERD_NODES[0].id,
    target: INITIAL_ERD_NODES[1].id,
    label: "users.id -> orders.user_id",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export const useStore = create((set, get) => ({
  projectId: DEFAULT_PROJECT_ID,
  projectName: "EHF Workspace",
  mode: "whiteboard",
  whiteboardPersistenceKey: "ehf-board-whiteboard",
  flowNodes: INITIAL_FLOW_NODES,
  flowEdges: INITIAL_FLOW_EDGES,
  erdNodes: INITIAL_ERD_NODES,
  erdEdges: INITIAL_ERD_EDGES,
  saveStatus: "Saved",
  selectedFlowNodeId: null,
  selectedErdNodeId: null,
  editingErdNodeId: null,

  setMode: (mode) => set({ mode }),
  setProjectName: (projectName) => set({ projectName }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  onFlowNodesChange: (changes) =>
    set((state) => ({ flowNodes: applyNodeChanges(changes, state.flowNodes) })),

  onFlowEdgesChange: (changes) =>
    set((state) => ({ flowEdges: applyEdgeChanges(changes, state.flowEdges) })),

  onFlowConnect: (connection) =>
    set((state) => ({
      flowEdges: addEdge(
        {
          ...connection,
          id: uuidv4(),
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        state.flowEdges,
      ),
    })),

  addFlowNode: (kind) =>
    set((state) => ({
      flowNodes: [
        ...state.flowNodes,
        makeFlowNode(kind, {
          x: 130 + Math.random() * 280,
          y: 90 + Math.random() * 280,
        }),
      ],
    })),

  updateFlowNodeLabel: (nodeId, label) =>
    set((state) => ({
      flowNodes: state.flowNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label } } : node,
      ),
    })),

  deleteSelectedFlowElements: () =>
    set((state) => ({
      flowNodes: state.flowNodes.filter((node) => !node.selected),
      flowEdges: state.flowEdges.filter((edge) => !edge.selected),
    })),

  updateFlowNodeColor: (nodeId, color) =>
    set((state) => ({
      flowNodes: state.flowNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, color } } : node,
      ),
    })),

  duplicateFlowNode: (nodeId) =>
    set((state) => {
      const nodeToDuplicate = state.flowNodes.find((n) => n.id === nodeId);
      if (!nodeToDuplicate) return {};
      return {
        flowNodes: [
          ...state.flowNodes,
          {
            ...nodeToDuplicate,
            id: uuidv4(),
            position: {
              x: nodeToDuplicate.position.x + 100,
              y: nodeToDuplicate.position.y + 100,
            },
          },
        ],
      };
    }),

  updateFlowEdgeLabel: (edgeId, label) =>
    set((state) => ({
      flowEdges: state.flowEdges.map((edge) =>
        edge.id === edgeId ? { ...edge, label } : edge,
      ),
    })),

  setSelectedFlowNode: (nodeId) => set({ selectedFlowNodeId: nodeId }),

  onErdNodesChange: (changes) =>
    set((state) => ({ erdNodes: applyNodeChanges(changes, state.erdNodes) })),

  onErdEdgesChange: (changes) =>
    set((state) => ({ erdEdges: applyEdgeChanges(changes, state.erdEdges) })),

  onErdConnect: (connection) =>
    set((state) => ({
      erdEdges: addEdge(
        {
          ...connection,
          id: uuidv4(),
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        state.erdEdges,
      ),
    })),

  addErdTable: () =>
    set((state) => ({
      erdNodes: [
        ...state.erdNodes,
        makeErdNode(
          `table_${state.erdNodes.length + 1}`,
          {
            x: 120 + Math.random() * 360,
            y: 80 + Math.random() * 280,
          },
          [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "field_name", type: "TEXT", key: "" },
          ],
        ),
      ],
    })),

  deleteSelectedErdElements: () =>
    set((state) => ({
      erdNodes: state.erdNodes.filter((node) => !node.selected),
      erdEdges: state.erdEdges.filter((edge) => !edge.selected),
    })),

  updateErdTableName: (tableId, tableName) =>
    set((state) => ({
      erdNodes: state.erdNodes.map((node) =>
        node.id === tableId
          ? { ...node, data: { ...node.data, tableName } }
          : node,
      ),
    })),

  updateErdField: (tableId, fieldIndex, updatedField) =>
    set((state) => ({
      erdNodes: state.erdNodes.map((node) =>
        node.id === tableId
          ? {
              ...node,
              data: {
                ...node.data,
                fields: node.data.fields.map((f, i) =>
                  i === fieldIndex ? updatedField : f,
                ),
              },
            }
          : node,
      ),
    })),

  addErdField: (
    tableId,
    field = { name: "new_field", type: "TEXT", key: "" },
  ) =>
    set((state) => ({
      erdNodes: state.erdNodes.map((node) =>
        node.id === tableId
          ? {
              ...node,
              data: {
                ...node.data,
                fields: [...node.data.fields, field],
              },
            }
          : node,
      ),
    })),

  deleteErdField: (tableId, fieldIndex) =>
    set((state) => ({
      erdNodes: state.erdNodes.map((node) =>
        node.id === tableId
          ? {
              ...node,
              data: {
                ...node.data,
                fields: node.data.fields.filter((_, i) => i !== fieldIndex),
              },
            }
          : node,
      ),
    })),

  updateErdRelationshipType: (edgeId, relationType) =>
    set((state) => ({
      erdEdges: state.erdEdges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, relationType } }
          : edge,
      ),
    })),

  setSelectedErdNode: (nodeId) => set({ selectedErdNodeId: nodeId }),
  setEditingErdNode: (nodeId) => set({ editingErdNodeId: nodeId }),

  duplicateErdNode: (tableId) =>
    set((state) => {
      const nodeToDuplicate = state.erdNodes.find((n) => n.id === tableId);
      if (!nodeToDuplicate) return state;

      const newNodeId = `erd-table-${Date.now()}`;
      const newNode = {
        ...nodeToDuplicate,
        id: newNodeId,
        position: {
          x: nodeToDuplicate.position.x + 100,
          y: nodeToDuplicate.position.y + 100,
        },
        data: {
          ...nodeToDuplicate.data,
          tableName: `${nodeToDuplicate.data.tableName}_copy`,
          fields: [...nodeToDuplicate.data.fields],
        },
      };

      return {
        erdNodes: [...state.erdNodes, newNode],
      };
    }),

  resetProjectByMode: (mode) => {
    if (mode === "flowchart") {
      set({
        flowNodes: INITIAL_FLOW_NODES,
        flowEdges: INITIAL_FLOW_EDGES,
        saveStatus: "Saved",
      });
      return;
    }

    if (mode === "erd") {
      set({
        erdNodes: INITIAL_ERD_NODES,
        erdEdges: INITIAL_ERD_EDGES,
        saveStatus: "Saved",
      });
    }
  },

  getProjectPayload: () => {
    const state = get();
    return {
      projectId: state.projectId,
      projectName: state.projectName,
      mode: state.mode,
      flowNodes: state.flowNodes,
      flowEdges: state.flowEdges,
      erdNodes: state.erdNodes,
      erdEdges: state.erdEdges,
    };
  },

  importProjectPayload: (payload) =>
    set({
      projectId: payload.projectId || DEFAULT_PROJECT_ID,
      projectName: payload.projectName || "Imported EHF Workspace",
      mode: payload.mode || "whiteboard",
      flowNodes: payload.flowNodes || INITIAL_FLOW_NODES,
      flowEdges: payload.flowEdges || INITIAL_FLOW_EDGES,
      erdNodes: payload.erdNodes || INITIAL_ERD_NODES,
      erdEdges: payload.erdEdges || INITIAL_ERD_EDGES,
      saveStatus: "Saved",
    }),

  loadFromStorage: () => {
    const state = get();
    const loaded = loadProjectFromStorage(state.projectId);

    if (!loaded) {
      return;
    }

    set({
      projectName: loaded.projectName || state.projectName,
      mode: loaded.mode || state.mode,
      flowNodes: loaded.flowNodes || state.flowNodes,
      flowEdges: loaded.flowEdges || state.flowEdges,
      erdNodes: loaded.erdNodes || state.erdNodes,
      erdEdges: loaded.erdEdges || state.erdEdges,
      saveStatus: "Saved",
    });
  },

  saveToStorage: () => {
    const payload = get().getProjectPayload();
    saveProjectToStorage(payload.projectId, payload);
  },
}));

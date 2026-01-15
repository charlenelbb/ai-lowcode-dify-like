import { create } from 'zustand'
import type { Workflow, Node, Edge, WorkflowExecutionResult } from '@types'

interface WorkflowStore {
  // 当前工作流
  workflow: Workflow | null
  setWorkflow: (workflow: Workflow | null) => void

  // 节点和边管理
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void

  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNode: (nodeId: string, data: Partial<Node>) => void

  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void

  // 选中状态
  selectedNodeId: string | null
  setSelectedNodeId: (nodeId: string | null) => void

  // 执行状态
  isRunning: boolean
  setIsRunning: (running: boolean) => void
  executionResults: WorkflowExecutionResult[]
  setExecutionResults: (results: WorkflowExecutionResult[]) => void

  // 撤销/重做
  undo: () => void
  redo: () => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflow: null,
  setWorkflow: (workflow) => set({ workflow }),

  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    })),

  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...data } : n)),
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    })),

  selectedNodeId: null,
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  isRunning: false,
  setIsRunning: (running) => set({ isRunning: running }),

  executionResults: [],
  setExecutionResults: (results) => set({ executionResults: results }),

  undo: () => {
    // TODO: 实现撤销
  },

  redo: () => {
    // TODO: 实现重做
  },
}))

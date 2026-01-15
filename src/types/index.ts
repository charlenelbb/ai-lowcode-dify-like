// 节点类型
export interface Node {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: NodeData
  selected?: boolean
}

// 节点数据
export interface NodeData {
  label: string
  config?: Record<string, any>
  inputs?: Record<string, any>
  outputs?: Record<string, any>
}

// 节点类型枚举
export enum NodeType {
  // 输入类
  INPUT = 'input',
  // 处理类
  AI_PROMPT = 'ai_prompt',
  LLM = 'llm',
  TOOL = 'tool',
  CONDITION = 'condition',
  LOOP = 'loop',
  // 输出类
  OUTPUT = 'output',
  // 数据处理
  TRANSFORMER = 'transformer',
  FILTER = 'filter',
}

// 边（连接）
export interface Edge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  animated?: boolean
  label?: string
}

// 工作流
export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: Node[]
  edges: Edge[]
  created_at?: string
  updated_at?: string
}

// 工作流执行结果
export interface WorkflowExecutionResult {
  status: 'success' | 'failed' | 'running'
  nodeId: string
  output?: any
  error?: string
  executedAt: string
}

// AI 模型配置
export interface AIModelConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'custom'
  model: string
  apiKey?: string
  endpoint?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

// 工具定义
export interface Tool {
  id: string
  name: string
  description: string
  type: 'http' | 'javascript' | 'python' | 'plugin'
  inputs: Record<string, InputSchema>
  outputs: Record<string, OutputSchema>
  config?: Record<string, any>
}

// 输入/输出Schema
export interface InputSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description: string
  required?: boolean
  default?: any
  enum?: any[]
}

export interface OutputSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description: string
}

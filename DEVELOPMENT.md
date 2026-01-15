# 快速开发指南

## 项目概览

这是一个 AI 低代码平台的前端实现，灵感来自 Dify。主要用于创建和执行 AI 工作流。

## 核心模块说明

### 1. 类型系统 (`src/types/index.ts`)

定义了所有核心类型：
- `Node`: 工作流节点
- `Edge`: 节点连接
- `Workflow`: 完整工作流
- `NodeType`: 节点类型枚举
- `AIModelConfig`: AI 模型配置

### 2. 状态管理 (`src/stores/workflow.ts`)

使用 Zustand 管理全局状态：
- `nodes`: 当前工作流的所有节点
- `edges`: 节点间的连接
- `selectedNodeId`: 当前选中节点
- `executionResults`: 工作流执行结果

### 3. 主要组件

#### WorkflowEditor.tsx
主要编辑器组件，包含以下子组件：
- `Canvas`: 画布，展示和编辑节点
- `Sidebar`: 节点库，提供可拖拽的节点
- `Toolbar`: 工具栏，保存、导入、导出、运行等
- `PropertiesPanel`: 属性编辑面板，编辑选中节点的属性

#### Canvas.tsx
画布组件，处理：
- 节点拖拽
- 画布缩放和平移
- 视觉反馈

#### FlowNode.tsx
单个节点的视觉表示，包括：
- 节点标题和类型
- 输入/输出连接点（handles）
- 删除按钮

### 4. 工具函数

#### aiService.ts
AI 服务封装，支持多个 AI 提供商：
- OpenAI
- Anthropic
- 本地 LLM
- 自定义 API

#### workflowExecutor.ts
工作流执行引擎：
- 节点执行逻辑
- 数据流传递
- 错误处理

#### common.ts
通用工具函数：
- ID 生成
- 深度克隆
- 防抖/节流
- 节点连接查询

## 常见开发任务

### 添加新的节点类型

1. **定义节点类型**

```typescript
// src/types/index.ts
export enum NodeType {
  // ... 其他类型
  MY_NODE = 'my_node',  // 添加新类型
}
```

2. **在侧边栏添加节点**

```typescript
// src/components/sidebar/Sidebar.tsx
{
  category: '自定义',
  nodes: [
    { type: NodeType.MY_NODE, label: '我的节点', icon: MyIcon }
  ]
}
```

3. **实现执行逻辑**

```typescript
// src/utils/workflowExecutor.ts
private async executeNodeLogic(node: Node, inputs: Record<string, any>) {
  switch (node.type) {
    case 'my_node':
      return await this.executeMyNode(node, inputs);
    // ... 其他类型
  }
}

private async executeMyNode(node: Node, inputs: Record<string, any>) {
  // 实现节点逻辑
  return { /* 输出 */ };
}
```

4. **配置属性编辑**

```typescript
// src/components/properties/PropertiesPanel.tsx
{selectedNode.type === 'my_node' && (
  <div className={styles.form_group}>
    {/* 配置表单 */}
  </div>
)}
```

### 集成新的 AI 提供商

```typescript
// src/utils/aiService.ts
private async callMyProvider(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await axios.post(
    'https://your-api-endpoint.com/v1/complete',
    {
      prompt,
      systemPrompt,
      temperature: this.config!.temperature
    }
  );
  return response.data.result;
}

// 在 callLLM 方法中添加
case 'my_provider':
  return await this.callMyProvider(prompt, systemPrompt);
```

### 自定义节点样式

编辑 `src/styles/node.module.scss` 中的 `.node` 和相关类：

```scss
.node {
  // 自定义样式
  border-left: 4px solid #your-color;
  // ...
}
```

### 添加工作流持久化

```typescript
// 保存到本地存储
localStorage.setItem(`workflow_${workflow.id}`, JSON.stringify(workflow));

// 读取
const saved = localStorage.getItem(`workflow_${workflow.id}`);
const workflow = JSON.parse(saved);
```

## 调试技巧

### 打印执行日志

在 `workflowExecutor.ts` 中添加日志：

```typescript
console.log(`执行节点: ${nodeId}`, inputs);
```

### 检查节点状态

使用浏览器开发者工具的 Redux DevTools 或直接检查 Zustand 状态：

```typescript
// 在浏览器控制台
import { useWorkflowStore } from './stores/workflow';
useWorkflowStore.getState().nodes  // 查看所有节点
```

### 测试工作流执行

创建一个测试工作流，包含简单的节点：

```typescript
const testWorkflow: Workflow = {
  id: 'test',
  name: 'Test',
  nodes: [
    { id: 'input-1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Input' } },
    { id: 'output-1', type: 'output', position: { x: 100, y: 0 }, data: { label: 'Output' } }
  ],
  edges: [
    { id: 'edge-1', source: 'input-1', target: 'output-1' }
  ]
};

workflowExecutor.execute(testWorkflow);
```

## 性能优化建议

1. **使用 React.memo 优化组件**

```typescript
export const FlowNode = React.memo(({ node, onDragStart }: NodeProps) => {
  // ...
});
```

2. **使用 useCallback 缓存函数**

```typescript
const handleDrop = useCallback((e) => {
  // ...
}, [dependencies]);
```

3. **延迟加载大型工作流**

```typescript
// 只在需要时加载节点细节
const [loadedNodes, setLoadedNodes] = useState<Set<string>>(new Set());
```

## 常见问题

**Q: 如何添加自定义节点连接验证？**

A: 在 `Canvas.tsx` 的拖拽事件中添加验证逻辑。

**Q: 如何支持多个输入/输出？**

A: 扩展 `Node` 类型，支持多个 handles，在 `FlowNode.tsx` 中渲染多个连接点。

**Q: 如何实现撤销/重做？**

A: 实现一个历史堆栈，使用 `useReducer` 或创建一个专门的中间件。

## 资源链接

- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [Vite 文档](https://vitejs.dev)

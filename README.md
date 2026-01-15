# AI 低代码平台（Dify-like）

一个类似 Dify 的 AI 低代码平台前端实现，提供可视化工作流编辑器、节点系统、AI 集成等功能。

## 🎯 核心功能

### 1. **可视化工作流编辑器**
- 拖拽节点到画布
- 连接节点创建工作流
- 支持缩放和平移
- 实时编辑节点属性

### 2. **节点系统**
支持多种节点类型：
- **输入/输出**: INPUT、OUTPUT
- **AI 节点**: AI_PROMPT、LLM
- **逻辑控制**: CONDITION（条件判断）、LOOP（循环）
- **数据处理**: TRANSFORMER（数据转换）、FILTER（数据过滤）
- **工具**: TOOL（工具调用）

### 3. **工作流管理**
- 创建、编辑、保存工作流
- 导入/导出工作流（JSON 格式）
- 本地存储工作流
- 工作流版本管理

### 4. **AI 集成**
- 支持多个 AI 提供商
  - OpenAI
  - Anthropic
  - 本地 LLM
  - 自定义 API
- 灵活的 AI 模型配置
- 提示词工程支持

### 5. **工作流执行**
- 节点执行引擎
- 数据流传递
- 错误处理和重试
- 执行结果跟踪

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── canvas/         # 画布相关组件
│   ├── sidebar/        # 节点库侧边栏
│   ├── toolbar/        # 工具栏
│   ├── properties/     # 属性编辑面板
│   ├── nodes/          # 节点和边组件
│   └── WorkflowEditor.tsx  # 主编辑器组件
├── types/              # TypeScript 类型定义
├── stores/             # Zustand 状态管理
├── utils/              # 工具函数
│   ├── common.ts       # 通用工具
│   ├── aiService.ts    # AI 服务
│   └── workflowExecutor.ts  # 工作流执行引擎
├── hooks/              # 自定义 React Hooks
├── styles/             # SCSS 样式
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

浏览器访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 💡 使用指南

### 创建工作流

1. **添加节点**
   - 从左侧侧边栏拖拽节点到画布
   - 支持多种节点类型

2. **配置节点**
   - 选中节点（节点会高亮）
   - 在右侧属性面板编辑配置
   - 支持自定义标题、提示词、条件表达式等

3. **连接节点**
   - 拖拽节点间的连接点创建边
   - 节点间通过边进行数据传递

4. **执行工作流**
   - 点击工具栏的"运行"按钮
   - 查看执行结果

### 工作流导出/导入

**导出**：点击工具栏的下载按钮，导出为 JSON 文件

**导入**：点击工具栏的上传按钮，导入之前保存的工作流

### AI 模型配置

在代码中配置 AI 服务：

```typescript
import { aiService } from '@utils/aiService';

aiService.setConfig({
  provider: 'openai',
  model: 'gpt-4',
  apiKey: 'your-api-key',
  temperature: 0.7,
  maxTokens: 2000
});
```

## 🛠 技术栈

- **React 18**: UI 框架
- **TypeScript**: 类型安全
- **Zustand**: 状态管理
- **Vite**: 构建工具
- **SCSS**: 样式预处理
- **Lucide React**: 图标库
- **Axios**: HTTP 客户端

## 🔧 开发指南

### 添加新的节点类型

1. 在 `src/types/index.ts` 中的 `NodeType` 枚举添加新类型
2. 在 `src/components/sidebar/Sidebar.tsx` 中添加节点到节点库
3. 在 `src/utils/workflowExecutor.ts` 中实现节点执行逻辑

### 扩展 AI 服务

在 `src/utils/aiService.ts` 中添加新的 AI 提供商支持：

```typescript
private async callNewProvider(prompt: string): Promise<string> {
  // 实现 API 调用逻辑
}
```

### 自定义样式

所有样式文件位于 `src/styles/` 目录，采用 SCSS 模块化方案。

## 📝 工作流格式

工作流采用 JSON 格式：

```json
{
  "id": "workflow_001",
  "name": "我的工作流",
  "description": "工作流描述",
  "nodes": [
    {
      "id": "input-1",
      "type": "input",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "用户输入" }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "input-1",
      "target": "ai_prompt-1"
    }
  ]
}
```

## 🔮 未来规划

- [ ] 完整的节点连接线逻辑
- [ ] 撤销/重做功能
- [ ] 更多 AI 模型支持
- [ ] 工作流模板库
- [ ] 团队协作功能
- [ ] 工作流监控和日志
- [ ] 插件系统
- [ ] 更复杂的数据处理节点

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

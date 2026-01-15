import React from 'react'
import { NodeType } from '@types/index'
import styles from '@styles/sidebar.module.scss'
import {
  Plus,
  Send,
  Zap,
  Filter,
  GitBranch,
  LoopIcon,
  Trash2,
  Database,
} from 'lucide-react'

const NODE_CATEGORIES = [
  {
    category: '输入/输出',
    nodes: [
      { type: NodeType.INPUT, label: '输入', icon: Plus },
      { type: NodeType.OUTPUT, label: '输出', icon: Send },
    ],
  },
  {
    category: 'AI 节点',
    nodes: [
      { type: NodeType.AI_PROMPT, label: 'AI 提示', icon: Zap },
      { type: NodeType.LLM, label: 'LLM 模型', icon: Zap },
    ],
  },
  {
    category: '逻辑控制',
    nodes: [
      { type: NodeType.CONDITION, label: '条件判断', icon: GitBranch },
      { type: NodeType.LOOP, label: '循环', icon: LoopIcon },
    ],
  },
  {
    category: '数据处理',
    nodes: [
      { type: NodeType.TRANSFORMER, label: '数据转换', icon: Database },
      { type: NodeType.FILTER, label: '数据过滤', icon: Filter },
    ],
  },
  {
    category: '工具',
    nodes: [{ type: NodeType.TOOL, label: '工具调用', icon: Trash2 }],
  },
]

export const Sidebar: React.FC = () => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('nodeType', nodeType)
  }

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>节点库</h2>

      {NODE_CATEGORIES.map((category) => (
        <div key={category.category} className={styles.category}>
          <h3 className={styles.category_title}>{category.category}</h3>
          <div className={styles.nodes_list}>
            {category.nodes.map((node) => {
              const Icon = node.icon
              return (
                <div
                  key={node.type}
                  className={styles.node_item}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.type)}
                  title="拖拽到画布中添加节点"
                >
                  <Icon size={16} />
                  <span>{node.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

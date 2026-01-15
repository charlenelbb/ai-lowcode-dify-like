import React from 'react'
import { Node as FlowNode } from '@types/index'
import { useWorkflowStore } from '@stores/workflow'
import styles from '@styles/node.module.scss'
import { Trash2 } from 'lucide-react'

interface NodeProps {
  node: FlowNode
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
}

export const FlowNode: React.FC<NodeProps> = ({
  node,
  onDragStart,
  onDragEnd,
}) => {
  const { removeNode, selectedNodeId } = useWorkflowStore()

  const isSelected = selectedNodeId === node.id

  const getNodeColor = () => {
    const colorMap: Record<string, string> = {
      input: '#3b82f6',
      output: '#10b981',
      ai_prompt: '#f59e0b',
      llm: '#f59e0b',
      tool: '#8b5cf6',
      condition: '#ec4899',
      loop: '#06b6d4',
      transformer: '#14b8a6',
      filter: '#6366f1',
    }
    return colorMap[node.type] || '#6b7280'
  }

  return (
    <div
      className={`${styles.node} ${isSelected ? styles.selected : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        left: node.position.x,
        top: node.position.y,
        borderLeftColor: getNodeColor(),
      }}
    >
      <div className={styles.node_header}>
        <span className={styles.node_title}>{node.data.label}</span>
        <button
          className={styles.delete_btn}
          onClick={() => removeNode(node.id)}
          title="删除节点"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className={styles.node_content}>
        <p className={styles.node_type}>{node.type}</p>
      </div>

      <div className={styles.handles}>
        <div className={styles.handle_group}>
          <div className={`${styles.handle} ${styles.input}`} title="输入" />
        </div>
        <div className={styles.handle_group}>
          <div className={`${styles.handle} ${styles.output}`} title="输出" />
        </div>
      </div>
    </div>
  )
}

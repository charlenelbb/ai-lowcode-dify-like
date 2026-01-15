import React, { useCallback } from 'react'
import { useWorkflowStore } from '@stores/workflow'
import { Node as FlowNode, Edge as FlowEdge, NodeType } from '@types/index'
import { Canvas } from './canvas/Canvas'
import { Sidebar } from './sidebar/Sidebar'
import { Toolbar } from './toolbar/Toolbar'
import { PropertiesPanel } from './properties/PropertiesPanel'
import styles from '@styles/editor.module.scss'

export const WorkflowEditor: React.FC = () => {
  const { nodes, edges, addNode, addEdge } = useWorkflowStore()

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()

      const nodeType = e.dataTransfer.getData('nodeType') as NodeType
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newNode: FlowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position: { x, y },
        data: {
          label: `${nodeType} Node`,
        },
      }

      addNode(newNode)
    },
    [addNode]
  )

  return (
    <div className={styles.editor}>
      <Toolbar />
      <div className={styles.container}>
        <Sidebar />
        <div
          className={styles.canvas_container}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Canvas nodes={nodes} edges={edges} />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  )
}

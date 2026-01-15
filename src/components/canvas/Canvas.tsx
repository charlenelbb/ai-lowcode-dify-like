import React, { useCallback, useRef, useState } from 'react'
import type { Node as FlowNode, Edge as FlowEdge } from '@types'
import { useWorkflowStore } from '@stores/workflow'
import { FlowNode as NodeComponent } from '../nodes/FlowNode'
import { FlowEdge as EdgeComponent } from '../nodes/FlowEdge'
import styles from '@styles/canvas.module.scss'

interface CanvasProps {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export const Canvas: React.FC<CanvasProps> = ({ nodes, edges }) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const { updateNode, setSelectedNodeId } = useWorkflowStore()

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.node')) return

      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [pan]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((s) => Math.min(Math.max(s * delta, 0.1), 3))
  }, [])

  const handleNodeDragStart = useCallback(
    (e: React.DragEvent, nodeId: string) => {
      e.dataTransfer.effectAllowed = 'move'
      setSelectedNodeId(nodeId)
    },
    [setSelectedNodeId]
  )

  const handleNodeDragEnd = useCallback(
    (e: React.DragEvent, nodeId: string) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale

      updateNode(nodeId, { position: { x, y } })
    },
    [pan, scale, updateNode]
  )

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg className={styles.edges_layer}>
        {edges.map((edge) => (
          <EdgeComponent key={edge.id} edge={edge} />
        ))}
      </svg>

      <div
        className={styles.nodes_layer}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            onDragStart={(e) => handleNodeDragStart(e, node.id)}
            onDragEnd={(e) => handleNodeDragEnd(e, node.id)}
          />
        ))}
      </div>
    </div>
  )
}

import React from 'react'
import type { Edge } from './types/index'

interface EdgeProps {
  edge: Edge
}

export const FlowEdge: React.FC<EdgeProps> = ({ edge }) => {
  // 简单的直线连接
  const sx = 0
  const sy = 0
  const ex = 200
  const ey = 100

  return (
    <line
      x1={sx}
      y1={sy}
      x2={ex}
      y2={ey}
      stroke="#6b7280"
      strokeWidth={2}
      strokeDasharray={edge.animated ? '5,5' : undefined}
    />
  )
}

import React, { useEffect } from 'react'
import { WorkflowEditor } from './components/WorkflowEditor'
import { useWorkflowStore } from './stores/workflow'
import { Workflow } from './types/index'
import './styles/global.scss'

function App() {
  const { setWorkflow } = useWorkflowStore()

  useEffect(() => {
    // 初始化工作流
    const initialWorkflow: Workflow = {
      id: 'workflow_001',
      name: '我的第一个工作流',
      description: '这是一个测试工作流',
      nodes: [],
      edges: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setWorkflow(initialWorkflow)
  }, [setWorkflow])

  return <WorkflowEditor />
}

export default App
export default App

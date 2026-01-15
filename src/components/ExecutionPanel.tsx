import React, { useState } from 'react'
import { useWorkflowStore } from '@stores/workflow'
import { workflowExecutor } from '@utils/workflowExecutor'
import styles from '@styles/execution.module.scss'

export const ExecutionPanel: React.FC = () => {
  const {
    workflow,
    executionResults,
    setExecutionResults,
    isRunning,
    setIsRunning,
  } = useWorkflowStore()
  const [logs, setLogs] = useState<string[]>([])

  const handleExecute = async () => {
    if (!workflow) return

    setIsRunning(true)
    setLogs(['工作流开始执行...'])

    try {
      const results = await workflowExecutor.execute(workflow)
      setExecutionResults(results)

      const newLogs = [
        ...logs,
        '工作流执行完成',
        ...results.map(
          (r) => `节点 ${r.nodeId}: ${r.status === 'success' ? '成功' : '失败'}`
        ),
      ]
      setLogs(newLogs)
    } catch (error) {
      setLogs([
        ...logs,
        `执行出错: ${error instanceof Error ? error.message : String(error)}`,
      ])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className={styles.execution_panel}>
      <div className={styles.header}>
        <h3>执行面板</h3>
        <button
          onClick={handleExecute}
          disabled={!workflow || isRunning}
          className={styles.execute_btn}
        >
          {isRunning ? '执行中...' : '执行'}
        </button>
      </div>

      <div className={styles.logs}>
        {logs.map((log, i) => (
          <div key={i} className={styles.log_line}>
            {log}
          </div>
        ))}
      </div>

      {executionResults.length > 0 && (
        <div className={styles.results}>
          <h4>执行结果</h4>
          {executionResults.map((result) => (
            <div key={result.nodeId} className={styles.result_item}>
              <span className={`${styles.status} ${styles[result.status]}`}>
                {result.status === 'success' ? '✓' : '✗'}
              </span>
              <span>{result.nodeId}</span>
              {result.output && (
                <code>{JSON.stringify(result.output).substring(0, 50)}...</code>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

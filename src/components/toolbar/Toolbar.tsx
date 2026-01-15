import React from 'react'
import { useWorkflowStore } from '@stores/workflow'
import styles from '@styles/toolbar.module.scss'
import { Save, Play, Undo2, Redo2, Plus, Upload, Download } from 'lucide-react'

export const Toolbar: React.FC = () => {
  const { isRunning, setIsRunning, workflow } = useWorkflowStore()

  const handleSave = () => {
    if (workflow) {
      localStorage.setItem(`workflow_${workflow.id}`, JSON.stringify(workflow))
      alert('工作流已保存')
    }
  }

  const handleRun = () => {
    setIsRunning(!isRunning)
  }

  const handleExport = () => {
    if (workflow) {
      const dataStr = JSON.stringify(workflow, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${workflow.name}.json`
      link.click()
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string)
            // TODO: 实现导入逻辑
            console.log('导入工作流:', workflow)
          } catch (err) {
            alert('文件格式不正确')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar_group}>
        <button className={styles.btn} title="新建">
          <Plus size={18} />
        </button>
        <button className={styles.btn} onClick={handleSave} title="保存">
          <Save size={18} />
        </button>
        <button className={styles.btn} title="撤销">
          <Undo2 size={18} />
        </button>
        <button className={styles.btn} title="重做">
          <Redo2 size={18} />
        </button>
      </div>

      <div className={styles.toolbar_group}>
        <button
          className={`${styles.btn} ${isRunning ? styles.active : ''}`}
          onClick={handleRun}
          title={isRunning ? '停止' : '运行'}
        >
          <Play size={18} />
          <span>{isRunning ? '运行中' : '运行'}</span>
        </button>
      </div>

      <div className={styles.toolbar_group}>
        <button className={styles.btn} onClick={handleImport} title="导入">
          <Upload size={18} />
        </button>
        <button className={styles.btn} onClick={handleExport} title="导出">
          <Download size={18} />
        </button>
      </div>
    </div>
  )
}

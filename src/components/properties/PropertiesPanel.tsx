import React from 'react'
import { useWorkflowStore } from '@stores/workflow'
import styles from '@styles/properties.module.scss'

export const PropertiesPanel: React.FC = () => {
  const { selectedNodeId, nodes, updateNode } = useWorkflowStore()

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <div className={styles.properties_panel}>
        <p className={styles.empty_state}>选择一个节点来编辑属性</p>
      </div>
    )
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(selectedNodeId!, {
      data: { ...selectedNode.data, label: e.target.value },
    })
  }

  const handleConfigChange = (key: string, value: any) => {
    updateNode(selectedNodeId!, {
      data: {
        ...selectedNode.data,
        config: { ...selectedNode.data.config, [key]: value },
      },
    })
  }

  return (
    <div className={styles.properties_panel}>
      <h2 className={styles.title}>属性面板</h2>

      <div className={styles.form_group}>
        <label>节点标题</label>
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={handleLabelChange}
          className={styles.input}
        />
      </div>

      <div className={styles.form_group}>
        <label>节点类型</label>
        <input
          type="text"
          value={selectedNode.type}
          disabled
          className={styles.input}
        />
      </div>

      <div className={styles.form_group}>
        <label>位置</label>
        <div className={styles.position_group}>
          <input
            type="number"
            value={Math.round(selectedNode.position.x)}
            onChange={(e) =>
              updateNode(selectedNodeId!, {
                position: {
                  ...selectedNode.position,
                  x: Number(e.target.value),
                },
              })
            }
            placeholder="X"
            className={styles.input}
          />
          <input
            type="number"
            value={Math.round(selectedNode.position.y)}
            onChange={(e) =>
              updateNode(selectedNodeId!, {
                position: {
                  ...selectedNode.position,
                  y: Number(e.target.value),
                },
              })
            }
            placeholder="Y"
            className={styles.input}
          />
        </div>
      </div>

      <hr className={styles.divider} />

      <h3 className={styles.section_title}>节点配置</h3>

      {selectedNode.type === 'ai_prompt' && (
        <>
          <div className={styles.form_group}>
            <label>提示词</label>
            <textarea
              value={selectedNode.data.config?.prompt || ''}
              onChange={(e) => handleConfigChange('prompt', e.target.value)}
              className={styles.textarea}
              placeholder="输入AI提示词"
              rows={4}
            />
          </div>
          <div className={styles.form_group}>
            <label>模型</label>
            <select
              value={selectedNode.data.config?.model || 'gpt-4'}
              onChange={(e) => handleConfigChange('model', e.target.value)}
              className={styles.select}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude">Claude</option>
            </select>
          </div>
        </>
      )}

      {selectedNode.type === 'condition' && (
        <div className={styles.form_group}>
          <label>条件表达式</label>
          <input
            type="text"
            value={selectedNode.data.config?.expression || ''}
            onChange={(e) => handleConfigChange('expression', e.target.value)}
            className={styles.input}
            placeholder="e.g., value > 10"
          />
        </div>
      )}
    </div>
  )
}

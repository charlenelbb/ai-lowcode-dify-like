import { Workflow, Node, Edge, WorkflowExecutionResult } from '@types/index'

class WorkflowExecutor {
  private executionResults: Map<string, WorkflowExecutionResult> = new Map()
  private visitedNodes: Set<string> = new Set()

  async execute(workflow: Workflow): Promise<WorkflowExecutionResult[]> {
    this.executionResults.clear()
    this.visitedNodes.clear()

    // 获取所有起始节点（没有输入）
    const startNodes = this.getStartNodes(workflow)

    // 执行工作流
    for (const nodeId of startNodes) {
      await this.executeNode(nodeId, workflow)
    }

    return Array.from(this.executionResults.values())
  }

  private getStartNodes(workflow: Workflow): string[] {
    const nodeIds = new Set(workflow.nodes.map((n) => n.id))
    const nodesWithInput = new Set(workflow.edges.map((e) => e.target))

    return Array.from(nodeIds).filter((id) => !nodesWithInput.has(id))
  }

  private async executeNode(nodeId: string, workflow: Workflow): Promise<any> {
    if (this.visitedNodes.has(nodeId)) {
      return this.executionResults.get(nodeId)?.output
    }

    this.visitedNodes.add(nodeId)
    const node = workflow.nodes.find((n) => n.id === nodeId)

    if (!node) {
      throw new Error(`节点 ${nodeId} 不存在`)
    }

    try {
      // 获取输入数据
      const inputs = await this.getNodeInputs(nodeId, workflow)

      // 执行节点
      const output = await this.executeNodeLogic(node, inputs)

      // 记录结果
      this.executionResults.set(nodeId, {
        status: 'success',
        nodeId,
        output,
        executedAt: new Date().toISOString(),
      })

      // 执行下一个节点
      const nextNodeIds = this.getNextNodes(nodeId, workflow)
      for (const nextId of nextNodeIds) {
        await this.executeNode(nextId, workflow)
      }

      return output
    } catch (error) {
      this.executionResults.set(nodeId, {
        status: 'failed',
        nodeId,
        error: String(error),
        executedAt: new Date().toISOString(),
      })
      throw error
    }
  }

  private async getNodeInputs(
    nodeId: string,
    workflow: Workflow
  ): Promise<Record<string, any>> {
    const inputs: Record<string, any> = {}
    const incomingEdges = workflow.edges.filter((e) => e.target === nodeId)

    for (const edge of incomingEdges) {
      const sourceResult = this.executionResults.get(edge.source)
      if (sourceResult) {
        inputs[edge.targetHandle || 'default'] = sourceResult.output
      }
    }

    return inputs
  }

  private getNextNodes(nodeId: string, workflow: Workflow): string[] {
    return workflow.edges
      .filter((e) => e.source === nodeId)
      .map((e) => e.target)
  }

  private async executeNodeLogic(
    node: Node,
    inputs: Record<string, any>
  ): Promise<any> {
    switch (node.type) {
      case 'input':
        return inputs
      case 'output':
        return inputs
      case 'ai_prompt':
        return await this.executeAIPrompt(node, inputs)
      case 'transformer':
        return await this.executeTransformer(node, inputs)
      case 'filter':
        return await this.executeFilter(node, inputs)
      case 'condition':
        return await this.executeCondition(node, inputs)
      default:
        return inputs
    }
  }

  private async executeAIPrompt(
    node: Node,
    inputs: Record<string, any>
  ): Promise<string> {
    // TODO: 调用AI服务
    const prompt = node.data.config?.prompt || ''
    console.log('执行AI提示:', prompt, '输入:', inputs)
    return `AI响应: ${prompt}`
  }

  private async executeTransformer(
    node: Node,
    inputs: Record<string, any>
  ): Promise<any> {
    const code = node.data.config?.code || ''
    // 简单的数据转换示例
    try {
      // eslint-disable-next-line no-eval
      return eval(`(${code})(${JSON.stringify(inputs)})`)
    } catch {
      return inputs
    }
  }

  private async executeFilter(
    node: Node,
    inputs: Record<string, any>
  ): Promise<any> {
    const expression = node.data.config?.expression || ''
    // 简单的过滤示例
    if (expression && eval(expression)) {
      return inputs
    }
    return null
  }

  private async executeCondition(
    node: Node,
    inputs: Record<string, any>
  ): Promise<boolean> {
    const expression = node.data.config?.expression || ''
    try {
      // eslint-disable-next-line no-eval
      return eval(expression)
    } catch {
      return false
    }
  }
}

export const workflowExecutor = new WorkflowExecutor()

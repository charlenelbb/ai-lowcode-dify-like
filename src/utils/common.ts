// UUID生成
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substr(2)
  return prefix
    ? `${prefix}_${timestamp}${randomStr}`
    : `${timestamp}${randomStr}`
}

// 深度克隆
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let lastCall = 0
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }
  }) as T
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

// 检查两个节点是否连接
export const areNodesConnected = (
  source: string,
  target: string,
  edges: any[]
): boolean => {
  return edges.some((edge) => edge.source === source && edge.target === target)
}

// 获取节点的入度和出度
export const getNodeConnections = (nodeId: string, edges: any[]) => {
  return {
    incoming: edges.filter((e) => e.target === nodeId),
    outgoing: edges.filter((e) => e.source === nodeId),
  }
}

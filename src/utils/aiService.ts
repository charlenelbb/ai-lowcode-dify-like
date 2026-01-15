import axios from 'axios'
import { AIModelConfig } from '@types/index'

class AIService {
  private config: AIModelConfig | null = null

  setConfig(config: AIModelConfig) {
    this.config = config
  }

  async callLLM(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.config) {
      throw new Error('AI配置未设置')
    }

    try {
      // 根据不同的Provider调用相应的API
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI(prompt, systemPrompt)
        case 'anthropic':
          return await this.callAnthropic(prompt, systemPrompt)
        case 'local':
          return await this.callLocalLLM(prompt, systemPrompt)
        default:
          return await this.callCustom(prompt, systemPrompt)
      }
    } catch (error) {
      console.error('AI调用失败:', error)
      throw error
    }
  }

  private async callOpenAI(
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.config!.model,
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: this.config!.temperature || 0.7,
        max_tokens: this.config!.maxTokens || 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${this.config!.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.choices[0].message.content
  }

  private async callAnthropic(
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: this.config!.model,
        max_tokens: this.config!.maxTokens || 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': this.config!.apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.content[0].text
  }

  private async callLocalLLM(
    prompt: string,
    _systemPrompt?: string
  ): Promise<string> {
    const response = await axios.post(
      this.config!.endpoint || 'http://localhost:8000/api/v1/completions',
      {
        prompt,
        temperature: this.config!.temperature || 0.7,
        max_tokens: this.config!.maxTokens || 2000,
      }
    )

    return response.data.choices[0].text
  }

  private async callCustom(
    prompt: string,
    _systemPrompt?: string
  ): Promise<string> {
    const response = await axios.post(this.config!.endpoint || '', {
      prompt,
      temperature: this.config!.temperature || 0.7,
      max_tokens: this.config!.maxTokens || 2000,
    })

    return response.data.result || response.data.response
  }

  // 生成工作流执行计划
  async generateExecutionPlan(workflowDescription: string): Promise<any> {
    const systemPrompt = `你是一个AI工作流设计助手。用户会描述他们想要做的事，你应该生成一个详细的工作流执行计划，
    包含需要的节点类型和它们之间的连接。`

    return await this.callLLM(workflowDescription, systemPrompt)
  }

  // 验证和优化节点配置
  async validateNodeConfig(nodeType: string, config: any): Promise<any> {
    const systemPrompt = `你是一个AI工作流配置验证专家。验证给定的节点配置是否合理，
    并建议改进。`

    const prompt = `节点类型: ${nodeType}\n配置: ${JSON.stringify(
      config,
      null,
      2
    )}`

    return await this.callLLM(prompt, systemPrompt)
  }
}

export const aiService = new AIService()

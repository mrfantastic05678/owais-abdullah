// types/stack.ts
export interface ToolReview {
  _id: string
  name: string
  slug: { current: string }
  category:
    | 'agent-framework'
    | 'mcp'
    | 'router'
    | 'memory'
    | 'infra'
    | 'dev-tool'
    | 'observability'
    | 'auth'
  tagline: string
  myRating: number
  useCase: string
  stackLayer: string
  clientFit?: string
  websiteUrl: string
  githubUrl?: string
  docsUrl?: string
  logo?: {
    asset: {
      url: string
    }
  }
  featured: boolean
  dateAdded: string
  projectsUsingIt?: string[]
  body?: any[] // Portable Text
}

export type StackLayer =
  | 'Agent Framework'
  | 'MCP Server'
  | 'Router / Gateway'
  | 'Memory / Storage'
  | 'Infrastructure'
  | 'Dev Tool'
  | 'Observability'
  | 'Auth / Security'

export interface StackCategory {
  label: string
  value: ToolReview['category']
  description: string
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    label: 'Agent Framework',
    value: 'agent-framework',
    description: 'Frameworks for building AI agents and autonomous systems',
  },
  {
    label: 'MCP Server',
    value: 'mcp',
    description: 'Model Context Protocol servers for AI tool integration',
  },
  {
    label: 'Router / Gateway',
    value: 'router',
    description: 'API routing and request management systems',
  },
  {
    label: 'Memory / Storage',
    value: 'memory',
    description: 'Vector databases and memory systems for AI',
  },
  {
    label: 'Infrastructure',
    value: 'infra',
    description: 'Core infrastructure and deployment tools',
  },
  {
    label: 'Dev Tool',
    value: 'dev-tool',
    description: 'Development tools and environments',
  },
  {
    label: 'Observability',
    value: 'observability',
    description: 'Monitoring, logging, and debugging tools',
  },
  {
    label: 'Auth / Security',
    value: 'auth',
    description: 'Authentication, authorization, and security systems',
  },
]

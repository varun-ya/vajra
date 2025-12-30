// Enterprise API Service
export interface APIEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  description: string
  headers?: Record<string, string>
  body?: any
  response?: any
}

export interface APICollection {
  id: string
  name: string
  baseUrl: string
  endpoints: APIEndpoint[]
}

export class APIService {
  private static instance: APIService
  private collections: APICollection[] = []

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService()
    }
    return APIService.instance
  }

  constructor() {
    this.initializeDefaultCollections()
  }

  private initializeDefaultCollections() {
    this.collections = [
      {
        id: 'kriya-api',
        name: 'Kriya IDE API',
        baseUrl: 'https://api.kriya-ide.com',
        endpoints: [
          {
            id: 'auth-login',
            name: 'User Login',
            method: 'POST',
            url: '/auth/login',
            description: 'Authenticate user credentials',
            headers: { 'Content-Type': 'application/json' },
            body: { email: 'user@example.com', password: 'password' },
            response: { token: 'jwt-token', user: { id: 1, name: 'John Doe' } }
          },
          {
            id: 'projects-list',
            name: 'List Projects',
            method: 'GET',
            url: '/projects',
            description: 'Get user projects',
            headers: { 'Authorization': 'Bearer <token>' },
            response: [{ id: 1, name: 'My Project', status: 'active' }]
          },
          {
            id: 'deploy-create',
            name: 'Create Deployment',
            method: 'POST',
            url: '/deployments',
            description: 'Deploy project to environment',
            headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
            body: { projectId: 1, environment: 'production', branch: 'main' },
            response: { deploymentId: 'dep_123', status: 'pending' }
          }
        ]
      },
      {
        id: 'github-api',
        name: 'GitHub API',
        baseUrl: 'https://api.github.com',
        endpoints: [
          {
            id: 'repos-list',
            name: 'List Repositories',
            method: 'GET',
            url: '/user/repos',
            description: 'Get user repositories',
            headers: { 'Authorization': 'token <github-token>' },
            response: [{ id: 1, name: 'repo-name', full_name: 'user/repo-name' }]
          },
          {
            id: 'repo-contents',
            name: 'Get Repository Contents',
            method: 'GET',
            url: '/repos/{owner}/{repo}/contents/{path}',
            description: 'Get repository file contents',
            headers: { 'Authorization': 'token <github-token>' },
            response: { name: 'file.js', content: 'base64-content' }
          }
        ]
      }
    ]
  }

  getCollections(): APICollection[] {
    return this.collections
  }

  getCollection(id: string): APICollection | undefined {
    return this.collections.find(c => c.id === id)
  }

  async executeRequest(endpoint: APIEndpoint, baseUrl: string, variables?: Record<string, string>): Promise<any> {
    let url = baseUrl + endpoint.url
    
    // Replace URL variables
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, value)
      })
    }

    const options: RequestInit = {
      method: endpoint.method,
      headers: endpoint.headers || {}
    }

    if (endpoint.body && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      options.body = JSON.stringify(endpoint.body)
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  addCollection(collection: APICollection): void {
    this.collections.push(collection)
  }

  updateCollection(id: string, updates: Partial<APICollection>): void {
    const index = this.collections.findIndex(c => c.id === id)
    if (index !== -1) {
      this.collections[index] = { ...this.collections[index], ...updates }
    }
  }

  deleteCollection(id: string): void {
    this.collections = this.collections.filter(c => c.id !== id)
  }

  addEndpoint(collectionId: string, endpoint: APIEndpoint): void {
    const collection = this.getCollection(collectionId)
    if (collection) {
      collection.endpoints.push(endpoint)
    }
  }

  updateEndpoint(collectionId: string, endpointId: string, updates: Partial<APIEndpoint>): void {
    const collection = this.getCollection(collectionId)
    if (collection) {
      const index = collection.endpoints.findIndex(e => e.id === endpointId)
      if (index !== -1) {
        collection.endpoints[index] = { ...collection.endpoints[index], ...updates }
      }
    }
  }

  deleteEndpoint(collectionId: string, endpointId: string): void {
    const collection = this.getCollection(collectionId)
    if (collection) {
      collection.endpoints = collection.endpoints.filter(e => e.id !== endpointId)
    }
  }

  exportCollection(id: string): string {
    const collection = this.getCollection(id)
    if (!collection) {
      throw new Error('Collection not found')
    }
    return JSON.stringify(collection, null, 2)
  }

  importCollection(jsonData: string): void {
    try {
      const collection = JSON.parse(jsonData) as APICollection
      this.addCollection(collection)
    } catch (error) {
      throw new Error('Invalid collection format')
    }
  }
}
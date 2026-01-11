export interface FileTreeNode {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
  isExpanded?: boolean
  size?: number
  modified?: Date
}

export class FileTreeManager {
  private static instance: FileTreeManager
  private fileTree: FileTreeNode | null = null

  static getInstance(): FileTreeManager {
    if (!FileTreeManager.instance) {
      FileTreeManager.instance = new FileTreeManager()
    }
    return FileTreeManager.instance
  }

  constructor() {
    this.initializeDefaultTree()
  }

  private initializeDefaultTree() {
    this.fileTree = {
      id: 'root',
      name: 'workspace',
      path: '/',
      type: 'directory',
      isExpanded: true,
      children: []
    }
  }

  getFileTree(): FileTreeNode | null {
    return this.fileTree
  }

  toggleDirectory(nodeId: string): void {
    if (!this.fileTree) return
    this.toggleNodeExpansion(this.fileTree, nodeId)
  }

  private toggleNodeExpansion(node: FileTreeNode, targetId: string): boolean {
    if (node.id === targetId && node.type === 'directory') {
      node.isExpanded = !node.isExpanded
      return true
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (this.toggleNodeExpansion(child, targetId)) {
          return true
        }
      }
    }
    
    return false
  }

  addFile(parentId: string | null, name: string): FileTreeNode | null {
    if (!this.fileTree) return null
    
    const newFile: FileTreeNode = {
      id: `${Date.now()}-${name}`,
      name,
      path: parentId ? `${this.getNodePath(parentId)}/${name}` : `/${name}`,
      type: 'file',
      size: 0,
      modified: new Date()
    }
    
    if (parentId) {
      const parent = this.findNode(parentId)
      if (parent && parent.type === 'directory') {
        if (!parent.children) parent.children = []
        parent.children.push(newFile)
        parent.isExpanded = true
      }
    } else {
      if (!this.fileTree.children) this.fileTree.children = []
      this.fileTree.children.push(newFile)
    }
    
    return newFile
  }

  addFolder(parentId: string | null, name: string): FileTreeNode | null {
    if (!this.fileTree) return null
    
    const newFolder: FileTreeNode = {
      id: `${Date.now()}-${name}`,
      name,
      path: parentId ? `${this.getNodePath(parentId)}/${name}` : `/${name}`,
      type: 'directory',
      isExpanded: false,
      children: [],
      modified: new Date()
    }
    
    if (parentId) {
      const parent = this.findNode(parentId)
      if (parent && parent.type === 'directory') {
        if (!parent.children) parent.children = []
        parent.children.push(newFolder)
        parent.isExpanded = true
      }
    } else {
      if (!this.fileTree.children) this.fileTree.children = []
      this.fileTree.children.push(newFolder)
    }
    
    return newFolder
  }

  getNodeById(nodeId: string): FileTreeNode | null {
    return this.findNode(nodeId)
  }

  private getNodePath(nodeId: string): string {
    const node = this.findNode(nodeId)
    return node?.path || ''
  }

  findNode(nodeId: string): FileTreeNode | null {
    if (!this.fileTree) return null
    return this.findNodeRecursive(this.fileTree, nodeId)
  }

  private findNodeRecursive(node: FileTreeNode, targetId: string): FileTreeNode | null {
    if (node.id === targetId) return node
    
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeRecursive(child, targetId)
        if (found) return found
      }
    }
    
    return null
  }

  clearFileTree(): void {
    this.fileTree = {
      id: 'root',
      name: 'extracted-project',
      path: '/',
      type: 'directory',
      isExpanded: true,
      children: []
    }
  }

  setFileTree(newTree: FileTreeNode): void {
    this.fileTree = newTree
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase()
    const iconMap: Record<string, string> = {
      'tsx': 'ph-fill ph-file-tsx',
      'ts': 'ph-fill ph-file-ts',
      'js': 'ph-fill ph-file-js',
      'jsx': 'ph-fill ph-file-jsx',
      'css': 'ph-fill ph-file-css',
      'json': 'ph-fill ph-brackets-curly',
      'md': 'ph-fill ph-file-text',
      'txt': 'ph-fill ph-file-text'
    }
    return iconMap[ext || ''] || 'ph-fill ph-file'
  }
}
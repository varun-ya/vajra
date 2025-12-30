import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'all'

  // Simulate search delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const mockResults = [
    {
      id: '1',
      type: 'file',
      name: 'MainEditor.tsx',
      path: '/components/MainEditor.tsx',
      content: 'Monaco Editor component with pitch black theme',
      matches: query ? [{ line: 45, text: `const editor = monaco.editor.create(container, {` }] : []
    },
    {
      id: '2',
      type: 'file',
      name: 'ide-store.ts',
      path: '/stores/ide-store.ts',
      content: 'Zustand store for IDE state management',
      matches: query ? [{ line: 12, text: `interface IDEState {` }] : []
    },
    {
      id: '3',
      type: 'function',
      name: 'useIDEStore',
      path: '/stores/ide-store.ts',
      content: 'Main IDE store hook',
      matches: query ? [{ line: 89, text: `export const useIDEStore = create<IDEState>()` }] : []
    }
  ]

  const filteredResults = query 
    ? mockResults.filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase())
      )
    : mockResults

  return NextResponse.json({
    query,
    results: filteredResults,
    total: filteredResults.length,
    took: Math.floor(Math.random() * 100) + 50
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { query, replace, files, options } = body

  // Simulate replace operation
  await new Promise(resolve => setTimeout(resolve, 500))

  const replacements = files?.map((file: string) => ({
    file,
    replacements: Math.floor(Math.random() * 5) + 1
  })) || []

  return NextResponse.json({
    success: true,
    query,
    replace,
    files: replacements,
    total: replacements.reduce((sum: number, r: any) => sum + r.replacements, 0)
  })
}
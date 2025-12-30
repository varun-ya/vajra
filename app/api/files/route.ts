import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/'

  // Mock file tree
  const fileTree = {
    name: 'kriya-ide',
    type: 'directory',
    children: [
      {
        name: 'app',
        type: 'directory',
        children: [
          { name: 'layout.tsx', type: 'file', size: 1024 },
          { name: 'page.tsx', type: 'file', size: 2048 },
          { name: 'globals.css', type: 'file', size: 512 }
        ]
      },
      {
        name: 'components',
        type: 'directory',
        children: [
          { name: 'MainEditor.tsx', type: 'file', size: 4096 },
          { name: 'Sidebar.tsx', type: 'file', size: 3072 },
          { name: 'Terminal.tsx', type: 'file', size: 2560 }
        ]
      },
      {
        name: 'stores',
        type: 'directory',
        children: [
          { name: 'ide-store.ts', type: 'file', size: 1536 }
        ]
      },
      { name: 'package.json', type: 'file', size: 768 },
      { name: 'README.md', type: 'file', size: 1024 }
    ]
  }

  return NextResponse.json(fileTree)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { path, content, operation } = body

  // Simulate file operation delay
  await new Promise(resolve => setTimeout(resolve, 300))

  switch (operation) {
    case 'create':
      return NextResponse.json({
        success: true,
        message: `File created: ${path}`,
        file: { path, size: content?.length || 0 }
      })
    
    case 'update':
      return NextResponse.json({
        success: true,
        message: `File updated: ${path}`,
        file: { path, size: content?.length || 0 }
      })
    
    case 'delete':
      return NextResponse.json({
        success: true,
        message: `File deleted: ${path}`
      })
    
    default:
      return NextResponse.json(
        { success: false, error: 'Invalid operation' },
        { status: 400 }
      )
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { path, content } = body

  // Simulate file save
  await new Promise(resolve => setTimeout(resolve, 200))

  return NextResponse.json({
    success: true,
    message: `File saved: ${path}`,
    size: content?.length || 0,
    lastModified: new Date().toISOString()
  })
}
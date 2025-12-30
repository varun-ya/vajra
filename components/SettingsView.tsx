'use client'

import { useState } from 'react'
import { useIDEStore } from '@/stores/ide-store'

export default function SettingsView() {
  const [activeCategory, setActiveCategory] = useState('workspace')
  const { fontSize, setFontSize, tabSize, setTabSize, minimap, setMinimap, autoSave, setAutoSave } = useIDEStore()

  const categories = [
    { id: 'workspace', name: 'Workspace' },
    { id: 'editor', name: 'Editor' },
    { id: 'terminal', name: 'Terminal' },
    { id: 'git', name: 'Git & VCS' },
    { id: 'deployment', name: 'Deployment' },
    { id: 'security', name: 'Security' },
    { id: 'performance', name: 'Performance' },
    { id: 'collaboration', name: 'Collaboration' },
    { id: 'extensions', name: 'Extensions' },
    { id: 'ai', name: 'AI Assistant' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'keybindings', name: 'Keybindings' },
    { id: 'themes', name: 'Themes' },
    { id: 'languages', name: 'Languages' },
    { id: 'debugging', name: 'Debugging' }
  ]

  return (
    <div className="flex-1 bg-black overflow-y-auto">
      <div className="border-b border-zinc-800">
        <div className="flex items-center gap-4 px-6 py-3 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === category.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl">
        {activeCategory === 'workspace' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium text-white mb-2">Workspace Settings</h1>
              <p className="text-zinc-500 text-sm">Configure workspace and project settings</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Project Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Project Name</label>
                    <input type="text" defaultValue="kriya-ide" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Root Directory</label>
                    <input type="text" defaultValue="/workspace" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Default Branch</label>
                    <input type="text" defaultValue="main" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="autoSaveWs" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} className="w-4 h-4" />
                    <label htmlFor="autoSaveWs" className="text-sm text-zinc-300">Enable auto-save</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="autoFormat" defaultChecked className="w-4 h-4" />
                    <label htmlFor="autoFormat" className="text-sm text-zinc-300">Format on save</label>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Environment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Node.js Version</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>20.x LTS (Recommended)</option>
                      <option>18.x LTS</option>
                      <option>16.x</option>
                      <option>14.x</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Package Manager</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>npm</option>
                      <option>yarn</option>
                      <option>pnpm</option>
                      <option>bun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">TypeScript Config</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Strict</option>
                      <option>Recommended</option>
                      <option>Loose</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'editor' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium text-white mb-2">Editor Settings</h1>
              <p className="text-zinc-500 text-sm">Customize code editor behavior and appearance</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-zinc-400">Font Size</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setFontSize(Math.max(8, fontSize - 1))} className="w-8 h-8 rounded bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition">-</button>
                      <span className="text-sm text-white w-12 text-center">{fontSize}px</span>
                      <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="w-8 h-8 rounded bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Font Family</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>JetBrains Mono</option>
                      <option>Fira Code</option>
                      <option>Monaco</option>
                      <option>Consolas</option>
                      <option>Source Code Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Line Height</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>1.2</option>
                      <option>1.4</option>
                      <option>1.6 (Recommended)</option>
                      <option>1.8</option>
                      <option>2.0</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="minimap" checked={minimap} onChange={(e) => setMinimap(e.target.checked)} className="w-4 h-4" />
                    <label htmlFor="minimap" className="text-sm text-zinc-300">Show minimap</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="lineNumbers" defaultChecked className="w-4 h-4" />
                    <label htmlFor="lineNumbers" className="text-sm text-zinc-300">Show line numbers</label>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Behavior</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Tab Size</label>
                    <select value={tabSize} onChange={(e) => setTabSize(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces</option>
                      <option value={8}>8 spaces</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Word Wrap</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Off</option>
                      <option>On</option>
                      <option>Bounded</option>
                      <option>Word Bounded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Cursor Style</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Line</option>
                      <option>Block</option>
                      <option>Underline</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="autoFormat" defaultChecked className="w-4 h-4" />
                    <label htmlFor="autoFormat" className="text-sm text-zinc-300">Auto format on type</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="bracketPair" defaultChecked className="w-4 h-4" />
                    <label htmlFor="bracketPair" className="text-sm text-zinc-300">Bracket pair colorization</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'terminal' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium text-white mb-2">Terminal Settings</h1>
              <p className="text-zinc-500 text-sm">Configure integrated terminal settings</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Shell Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Default Shell</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>bash</option>
                      <option>zsh</option>
                      <option>fish</option>
                      <option>powershell</option>
                      <option>cmd</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Shell Path</label>
                    <input type="text" defaultValue="/bin/bash" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Working Directory</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Workspace Root</option>
                      <option>Current File Directory</option>
                      <option>Home Directory</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Display & Behavior</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Cursor Style</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Block</option>
                      <option>Line</option>
                      <option>Underline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Scrollback Lines</label>
                    <input type="number" defaultValue="1000" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Font Size</label>
                    <input type="number" defaultValue="14" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="terminalBell" className="w-4 h-4" />
                    <label htmlFor="terminalBell" className="text-sm text-zinc-300">Enable bell sound</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'git' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium text-white mb-2">Git & Version Control</h1>
              <p className="text-zinc-500 text-sm">Configure Git and version control settings</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">User Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">User Name</label>
                    <input type="text" placeholder="Your Name" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Email Address</label>
                    <input type="email" placeholder="your.email@example.com" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Default Editor</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Kriya IDE</option>
                      <option>vim</option>
                      <option>nano</option>
                      <option>code</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Repository Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="autoFetch" defaultChecked className="w-4 h-4" />
                    <label htmlFor="autoFetch" className="text-sm text-zinc-300">Auto-fetch from remote</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="showUntracked" defaultChecked className="w-4 h-4" />
                    <label htmlFor="showUntracked" className="text-sm text-zinc-300">Show untracked files</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="confirmPush" defaultChecked className="w-4 h-4" />
                    <label htmlFor="confirmPush" className="text-sm text-zinc-300">Confirm before push</label>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Merge Strategy</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Merge Commit</option>
                      <option>Squash and Merge</option>
                      <option>Rebase and Merge</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'security' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium text-white mb-2">Security Settings</h1>
              <p className="text-zinc-500 text-sm">Security and authentication configuration</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="twoFactor" className="w-4 h-4" />
                    <label htmlFor="twoFactor" className="text-sm text-zinc-300">Enable two-factor authentication</label>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Session Timeout</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>15 minutes</option>
                      <option>1 hour</option>
                      <option>8 hours</option>
                      <option>24 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Password Policy</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>Strong (Recommended)</option>
                      <option>Medium</option>
                      <option>Basic</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white mb-4">Access Control</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="ipWhitelist" className="w-4 h-4" />
                    <label htmlFor="ipWhitelist" className="text-sm text-zinc-300">Enable IP whitelist</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="apiRateLimit" defaultChecked className="w-4 h-4" />
                    <label htmlFor="apiRateLimit" className="text-sm text-zinc-300">API rate limiting</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="auditLog" defaultChecked className="w-4 h-4" />
                    <label htmlFor="auditLog" className="text-sm text-zinc-300">Enable audit logging</label>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Encryption Level</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white text-sm">
                      <option>AES-256 (Recommended)</option>
                      <option>AES-128</option>
                      <option>RSA-2048</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!['workspace', 'editor', 'terminal', 'git', 'security'].includes(activeCategory) && (
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium text-white mb-2">{categories.find(c => c.id === activeCategory)?.name}</h1>
              <p className="text-zinc-500 text-sm">Configuration options for {categories.find(c => c.id === activeCategory)?.name.toLowerCase()}</p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-6">
              <div className="text-center">
                <div className="text-zinc-400 mb-2">Settings for {categories.find(c => c.id === activeCategory)?.name} are coming soon</div>
                <div className="text-xs text-zinc-600">This section will include comprehensive configuration options</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
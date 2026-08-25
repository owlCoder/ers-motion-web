import type { Block, CourseDocument, DocumentPage } from '../types'

type Accent = 'blue' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'
let sequence = 0
const id = (prefix = 'canva') => `${prefix}-${String(++sequence).padStart(4, '0')}`
export const text = (variant: 'h1' | 'h2' | 'h3' | 'paragraph', html: string): Block => ({ id: id('text'), type: 'text', variant, html })
export const list = (items: string[], ordered = false): Block => ({ id: id('list'), type: 'list', ordered, items })
export const callout = (tone: 'info' | 'note' | 'task' | 'warning' | 'success', title: string, body: string): Block => ({ id: id('callout'), type: 'callout', tone, title, text: body })
export const code = (language: 'csharp' | 'bash' | 'json' | 'markdown' | 'typescript' | 'text', value: string, caption?: string): Block => ({ id: id('code'), type: 'code', language, code: value, caption, lineNumbers: true })
export const table = (headers: string[], rows: string[][], caption?: string): Block => ({ id: id('table'), type: 'table', headers, rows, caption })
export const image = (src: string, caption: string, alt: string): Block => ({ id: id('image'), type: 'image', src, caption, alt, widthPercent: 100 })
export const diagram = (title: string, items: Array<[string, string, Accent]>, footer?: string): Block => ({ id: id('diagram'), type: 'diagram', variant: 'flow', title, columns: Math.min(5, Math.max(2, items.length)) as 2 | 3 | 4 | 5, items: items.map(([title, subtitle, accent]) => ({ id: id('item'), title, subtitle, accent })), footer })
export const page = (label: string, blocks: Block[]): DocumentPage => ({ id: id('page'), label, layout: 'standard', blocks })

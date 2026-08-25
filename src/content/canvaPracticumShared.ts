import type { Block, CourseDocument, DocumentPage } from '../types'

type Accent = 'blue' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'
let sequence = 0
const id = (prefix = 'content') => `${prefix}-${String(++sequence).padStart(4, '0')}`

function clean(value: string) {
  return value
    .replace(/[\uFFFE\uFFFF]/g, '-')
    .replace(/\u00ad/g, '')
    .replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')
}

const cleanRows = (rows: string[][]) => rows.map((row) => row.map(clean))

export const text = (variant: 'h1' | 'h2' | 'h3' | 'paragraph', html: string): Block => ({ id: id('text'), type: 'text', variant, html: clean(html) })
export const list = (items: string[], ordered = false): Block => ({ id: id('list'), type: 'list', ordered, items: items.map(clean) })
export const callout = (tone: 'info' | 'note' | 'task' | 'warning' | 'success', title: string, body: string): Block => ({ id: id('callout'), type: 'callout', tone, title: clean(title), text: clean(body) })
export const code = (language: 'csharp' | 'bash' | 'json' | 'markdown' | 'typescript' | 'text', value: string, caption?: string): Block => ({ id: id('code'), type: 'code', language, code: value, caption: caption?.replace(/[\uFFFE\uFFFF]/g, '-'), lineNumbers: true })
export const table = (headers: string[], rows: string[][], caption?: string): Block => ({ id: id('table'), type: 'table', headers: headers.map(clean), rows: cleanRows(rows), caption: caption?.replace(/[\uFFFE\uFFFF]/g, '-') })
export const image = (src: string, caption: string, alt: string): Block => ({ id: id('image'), type: 'image', src, caption: caption.replace(/[\uFFFE\uFFFF]/g, '-'), alt, widthPercent: 100 })
export const diagram = (title: string, items: Array<[string, string, Accent]>, footer?: string): Block => ({ id: id('diagram'), type: 'diagram', variant: 'flow', title: clean(title), columns: Math.min(5, Math.max(2, items.length)) as 2 | 3 | 4 | 5, items: items.map(([itemTitle, subtitle, accent]) => ({ id: id('item'), title: clean(itemTitle), subtitle: clean(subtitle), accent })), footer: footer?.replace(/[\uFFFE\uFFFF]/g, '-') })
export const page = (label: string, blocks: Block[]): DocumentPage => ({ id: id('page'), label, layout: 'standard', blocks })

export type { CourseDocument }

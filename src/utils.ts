import type { Accent, Block, CodeLanguage, CourseDocument, DocumentPage } from './types'

export const ACCENTS: Record<Accent, { solid: string; soft: string; ink: string }> = {
  blue: { solid: '#2563eb', soft: '#eff6ff', ink: '#1d4ed8' },
  cyan: { solid: '#0891b2', soft: '#ecfeff', ink: '#0e7490' },
  violet: { solid: '#7c3aed', soft: '#f5f3ff', ink: '#6d28d9' },
  emerald: { solid: '#059669', soft: '#ecfdf5', ink: '#047857' },
  amber: { solid: '#d97706', soft: '#fffbeb', ink: '#b45309' },
  rose: { solid: '#e11d48', soft: '#fff1f2', ink: '#be123c' },
  slate: { solid: '#475569', soft: '#f8fafc', ink: '#334155' },
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function touch(doc: CourseDocument): CourseDocument {
  return { ...doc, updatedAt: new Date().toISOString() }
}

export function emptyPage(): DocumentPage {
  return {
    id: uid('page'),
    blocks: [
      { id: uid('block'), type: 'text', variant: 'h1', html: 'Nova stranica' },
      { id: uid('block'), type: 'text', variant: 'paragraph', html: 'Počnite da pišete ili dodajte novi blok.' },
    ],
  }
}

export function createBlock(type: Block['type']): Block {
  switch (type) {
    case 'text':
      return { id: uid('block'), type: 'text', variant: 'paragraph', html: 'Novi paragraf.' }
    case 'list':
      return { id: uid('block'), type: 'list', ordered: false, items: ['Nova stavka'] }
    case 'code':
      return { id: uid('block'), type: 'code', language: 'csharp', code: 'public sealed class Example\n{\n    // code\n}', caption: 'Primer koda', lineNumbers: false }
    case 'callout':
      return { id: uid('block'), type: 'callout', tone: 'info', title: 'Napomena', text: 'Dodajte kratko objašnjenje, zadatak ili važnu napomenu.' }
    case 'table':
      return { id: uid('block'), type: 'table', headers: ['Kolona 1', 'Kolona 2'], rows: [['Vrednost', 'Vrednost']] }
    case 'diagram':
      return {
        id: uid('block'),
        type: 'diagram',
        variant: 'flow',
        title: 'Tok',
        items: [
          { id: uid('item'), title: 'Korak 1', subtitle: 'opis', accent: 'blue' },
          { id: uid('item'), title: 'Korak 2', subtitle: 'opis', accent: 'cyan' },
          { id: uid('item'), title: 'Korak 3', subtitle: 'opis', accent: 'emerald' },
        ],
        columns: 3,
      }
    case 'image':
      return { id: uid('block'), type: 'image', src: '', caption: 'Opis slike', widthPercent: 100 }
    case 'institution':
      return {
        id: uid('block'),
        type: 'institution',
        university: 'Univerzitet u Novom Sadu',
        faculty: 'Fakultet tehničkih nauka',
        department: '',
        leftLogoSrc: '/brand/university.svg',
        rightLogoSrc: '/brand/ftn.svg',
      }
    case 'divider':
      return { id: uid('block'), type: 'divider' }
  }
}

const esc = (value: string) => value.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]!))

function tokeniseCSharp(code: string) {
  const source = esc(code)
  const stash: string[] = []
  const keep = (html: string) => `___ERS_TOKEN_${stash.push(html) - 1}___`
  let x = source
  x = x.replace(/(&quot;|\")[\s\S]*?(&quot;|\")/g, (m) => keep(`<span class="tok-string">${m}</span>`))
  x = x.replace(/\/\/.*$/gm, (m) => keep(`<span class="tok-comment">${m}</span>`))
  x = x.replace(/\b(public|private|protected|internal|sealed|static|readonly|class|record|interface|namespace|using|new|return|if|else|for|foreach|while|switch|case|break|continue|throw|try|catch|finally|async|await|var|void|bool|int|long|decimal|double|string|object|null|true|false|this|base|override|virtual|abstract|in|out|ref|where|get|set|init)\b/g, '<span class="tok-keyword">$1</span>')
  x = x.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span class="tok-type">$1</span>')
  x = x.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>')
  x = x.replace(/___ERS_TOKEN_(\d+)___/g, (_, i) => stash[Number(i)])
  return x
}

function tokeniseBash(code: string) {
  let x = esc(code)
  const stash: string[] = []
  const keep = (html: string) => `___ERS_TOKEN_${stash.push(html) - 1}___`
  x = x.replace(/#.*$/gm, (m) => keep(`<span class="tok-comment">${m}</span>`))
  x = x.replace(/(&quot;|\")[\s\S]*?(&quot;|\")/g, (m) => keep(`<span class="tok-string">${m}</span>`))
  x = x.replace(/\b(git|dotnet|npm|npx|cd|mkdir|rm|cp|mv|echo|cat|grep|find|curl|export|set|docker|node)\b/g, '<span class="tok-keyword">$1</span>')
  x = x.replace(/(--?[a-zA-Z0-9-]+)/g, '<span class="tok-attr">$1</span>')
  x = x.replace(/___ERS_TOKEN_(\d+)___/g, (_, i) => stash[Number(i)])
  return x
}

function tokeniseJson(code: string) {
  let x = esc(code)
  x = x.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="tok-property">$1</span>$2')
  x = x.replace(/(:\s*)(&quot;[^&]*?&quot;)/g, '$1<span class="tok-string">$2</span>')
  x = x.replace(/\b(true|false|null)\b/g, '<span class="tok-keyword">$1</span>')
  x = x.replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>')
  return x
}

function tokeniseMarkdown(code: string) {
  let x = esc(code)
  x = x.replace(/^(#{1,6}\s.*)$/gm, '<span class="tok-keyword">$1</span>')
  x = x.replace(/(`[^`]+`)/g, '<span class="tok-string">$1</span>')
  x = x.replace(/(\*\*[^*]+\*\*)/g, '<span class="tok-type">$1</span>')
  x = x.replace(/^(- |\d+\. )/gm, '<span class="tok-attr">$1</span>')
  return x
}

function tokeniseTs(code: string) {
  let x = tokeniseCSharp(code)
  x = x.replace(/\b(const|let|function|type|interface|import|from|export|default|extends|implements)\b/g, '<span class="tok-keyword">$1</span>')
  return x
}

export function highlightCode(code: string, language: CodeLanguage) {
  switch (language) {
    case 'csharp': return tokeniseCSharp(code)
    case 'bash': return tokeniseBash(code)
    case 'json': return tokeniseJson(code)
    case 'markdown': return tokeniseMarkdown(code)
    case 'typescript': return tokeniseTs(code)
    default: return esc(code)
  }
}

export function textFromHtml(html: string) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

export function pageLabel(page: DocumentPage, index: number) {
  const heading = page.blocks.find((b) => b.type === 'text' && ['title', 'h1', 'h2'].includes(b.variant))
  return page.label || (heading && heading.type === 'text' ? textFromHtml(heading.html) : `Strana ${index + 1}`)
}

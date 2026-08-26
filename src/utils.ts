import type { Accent, Block, CodeLanguage, CourseDocument, DocumentPage, TextBlock } from './types'

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
    case 'text': return { id: uid('block'), type: 'text', variant: 'paragraph', html: 'Novi paragraf.' }
    case 'list': return { id: uid('block'), type: 'list', ordered: false, items: ['Nova stavka'] }
    case 'code': return { id: uid('block'), type: 'code', language: 'csharp', code: 'public sealed class Example\n{\n    // code\n}', caption: 'Primer koda', lineNumbers: false }
    case 'callout': return { id: uid('block'), type: 'callout', tone: 'info', title: 'Napomena', text: 'Dodajte kratko objašnjenje, zadatak ili važnu napomenu.' }
    case 'table': return { id: uid('block'), type: 'table', headers: ['Kolona 1', 'Kolona 2'], rows: [['Vrednost', 'Vrednost']] }
    case 'diagram': return { id: uid('block'), type: 'diagram', variant: 'flow', title: 'Tok', items: [
      { id: uid('item'), title: 'Korak 1', subtitle: 'opis', accent: 'blue' },
      { id: uid('item'), title: 'Korak 2', subtitle: 'opis', accent: 'cyan' },
      { id: uid('item'), title: 'Korak 3', subtitle: 'opis', accent: 'emerald' },
    ], columns: 3 }
    case 'image': return { id: uid('block'), type: 'image', src: '', caption: 'Opis slike', widthPercent: 100 }
    case 'institution': return { id: uid('block'), type: 'institution', university: 'Univerzitet u Novom Sadu', faculty: 'Fakultet tehničkih nauka', department: '', leftLogoSrc: '/brand/university.svg', rightLogoSrc: '/brand/ftn.svg' }
    case 'divider': return { id: uid('block'), type: 'divider' }
  }
}

const esc = (value: string) => value.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]!))

type TokenStash = { keep: (html: string) => string; restore: (value: string) => string }

function createTokenStash(): TokenStash {
  const values: string[] = []
  const keep = (html: string) => {
    const index = values.push(html) - 1
    return `\uE000${String.fromCodePoint(0xE100 + index)}\uE001`
  }
  const restore = (value: string) => value.replace(/\uE000([\uE100-\uF8FF])\uE001/g, (_, marker: string) => values[marker.codePointAt(0)! - 0xE100] ?? '')
  return { keep, restore }
}

function tokeniseCSharp(code: string) {
  let x = esc(code)
  const stash = createTokenStash()
  x = x.replace(/(&quot;|\")[\s\S]*?(&quot;|\")/g, (m) => stash.keep(`<span class="tok-string">${m}</span>`))
  x = x.replace(/\/\/.*$/gm, (m) => stash.keep(`<span class="tok-comment">${m}</span>`))
  x = x.replace(/\b(public|private|protected|internal|sealed|static|readonly|class|record|interface|namespace|using|new|return|if|else|for|foreach|while|switch|case|break|continue|throw|try|catch|finally|async|await|var|void|bool|int|long|decimal|double|string|object|null|true|false|this|base|override|virtual|abstract|in|out|ref|where|get|set|init)\b/g, '<span class="tok-keyword">$1</span>')
  x = x.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span class="tok-type">$1</span>')
  x = x.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>')
  return stash.restore(x)
}

function tokeniseBash(code: string) {
  let x = esc(code)
  const stash = createTokenStash()
  x = x.replace(/#.*$/gm, (m) => stash.keep(`<span class="tok-comment">${m}</span>`))
  x = x.replace(/(&quot;|\")[\s\S]*?(&quot;|\")/g, (m) => stash.keep(`<span class="tok-string">${m}</span>`))
  x = x.replace(/(^|\s)(--?[a-zA-Z0-9][a-zA-Z0-9-]*)/gm, (_, prefix: string, flag: string) => `${prefix}${stash.keep(`<span class="tok-attr">${flag}</span>`)}`)
  x = x.replace(/\b(git|dotnet|npm|npx|cd|mkdir|rm|cp|mv|echo|cat|grep|find|curl|export|set|docker|node)\b/g, (m) => stash.keep(`<span class="tok-keyword">${m}</span>`))
  return stash.restore(x)
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
  let x = esc(code)
  const stash = createTokenStash()
  x = x.replace(/(&quot;|\")[\s\S]*?(&quot;|\")/g, (m) => stash.keep(`<span class="tok-string">${m}</span>`))
  x = x.replace(/\/\/.*$/gm, (m) => stash.keep(`<span class="tok-comment">${m}</span>`))
  x = x.replace(/\b(const|let|var|function|type|interface|class|import|from|export|default|extends|implements|public|private|protected|readonly|new|return|if|else|for|of|while|switch|case|break|continue|throw|try|catch|finally|async|await|void|boolean|number|string|object|null|undefined|true|false|this|in|keyof|typeof|as)\b/g, '<span class="tok-keyword">$1</span>')
  x = x.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span class="tok-type">$1</span>')
  x = x.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>')
  return stash.restore(x)
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

export type ArtifactKind = 'figure' | 'listing' | 'table'
export type ArtifactMeta = { kind: ArtifactKind; number: string; label: string }

function sectionNumber(block: TextBlock) {
  const value = textFromHtml(block.html).trim()
  const numbered = value.match(/^(\d+(?:\.\d+)*)\.?\s+/)
  if (numbered) return numbered[1]
  const exercise = value.match(/^Vežba\s+(\d+)\b/i)
  if (exercise) return exercise[1]
  if (/^Sadržaj\b/i.test(value)) return '0'
  if (/^Kako koristiti praktikum\b/i.test(value)) return '0'
  if (/^Tok semestra i projekta\b/i.test(value)) return '0'
  if (/^Sažetak\b/i.test(value)) return 'S'
  if (/^Preporučena literatura\b/i.test(value)) return 'L'
  return undefined
}

export function computeArtifactMeta(doc: CourseDocument): Record<string, ArtifactMeta> {
  const result: Record<string, ArtifactMeta> = {}
  const counters = new Map<string, Record<ArtifactKind, number>>()
  let section = '0'

  const next = (kind: ArtifactKind) => {
    const current = counters.get(section) || { figure: 0, listing: 0, table: 0 }
    current[kind] += 1
    counters.set(section, current)
    return `${section}.${current[kind]}`
  }

  for (const page of doc.pages) {
    for (const block of page.blocks) {
      if (block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)) {
        const detected = sectionNumber(block)
        if (detected) section = detected
        else if (block.variant === 'h1') section = '0'
      }
      if (block.type === 'image' || block.type === 'diagram') {
        const number = next('figure')
        result[block.id] = { kind: 'figure', number, label: `Slika ${number}` }
      } else if (block.type === 'code') {
        const number = next('listing')
        result[block.id] = { kind: 'listing', number, label: `Listing ${number}` }
      } else if (block.type === 'table') {
        const number = next('table')
        result[block.id] = { kind: 'table', number, label: `Tabela ${number}` }
      }
    }
  }

  return result
}

import type { Accent, Block, CalloutTone, CodeLanguage, CourseDocument, DiagramVariant, DocumentKind, DocumentTheme, TextVariant } from '../types'
import { ACCENTS, uid } from '../utils'
import { Icon } from './Icon'

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="control" {...props} />
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="control textarea" {...props} />
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="control" {...props} />
}

const stripHtml = (value: string) => {
  const div = document.createElement('div'); div.innerHTML = value; return div.textContent || ''
}

export function Inspector({ doc, block, onDocumentChange, onBlockChange, onClose }: {
  doc: CourseDocument
  block?: Block
  onDocumentChange: (doc: CourseDocument) => void
  onBlockChange: (block: Block) => void
  onClose?: () => void
}) {
  const patchDoc = (patch: Partial<CourseDocument>) => onDocumentChange({ ...doc, ...patch, updatedAt: new Date().toISOString() })
  const patchTheme = (patch: Partial<DocumentTheme>) => patchDoc({ theme: { ...doc.theme, ...patch } })

  if (!block) {
    return (
      <aside className="inspector no-print">
        <div className="panel-title"><div><b>Podešavanja dokumenta</b><span>A4 · light mode</span></div>{onClose && <button onClick={onClose}><Icon name="close" size={16} /></button>}</div>
        <div className="panel-section">
          <Field label="Naslov"><TextInput value={doc.title} onChange={(e) => patchDoc({ title: e.target.value })} /></Field>
          <Field label="Podnaslov"><TextInput value={doc.subtitle || ''} onChange={(e) => patchDoc({ subtitle: e.target.value })} /></Field>
          <Field label="Predmet"><TextInput value={doc.subject} onChange={(e) => patchDoc({ subject: e.target.value })} /></Field>
          <Field label="Vrsta dokumenta"><Select value={doc.kind} onChange={(e) => patchDoc({ kind: e.target.value as DocumentKind })}><option value="praktikum">Praktikum</option><option value="specifikacija">Projektna specifikacija</option><option value="skripta">Skripta</option><option value="dokument">Dokument</option></Select></Field>
        </div>
        <div className="panel-section">
          <div className="section-label">Izgled</div>
          <Field label="Tema"><Select value={doc.theme.name} onChange={(e) => patchTheme({ name: e.target.value as DocumentTheme['name'] })}><option>Academic Light</option><option>Editorial Light</option><option>Minimal Light</option></Select></Field>
          <Field label="Tipografija"><Select value={doc.theme.font} onChange={(e) => patchTheme({ font: e.target.value as DocumentTheme['font'] })}><option value="System">System / Inter</option><option value="Serif">Serif / akademski</option><option value="Humanist">Humanist sans</option></Select></Field>
          <Field label="Gustina"><Select value={doc.theme.density} onChange={(e) => patchTheme({ density: e.target.value as DocumentTheme['density'] })}><option value="comfortable">Komforna</option><option value="compact">Kompaktna</option></Select></Field>
          <Field label="Akcent">
            <div className="accent-picker">{(Object.keys(ACCENTS) as Accent[]).map((a) => <button key={a} className={doc.theme.accent === a ? 'active' : ''} style={{ background: ACCENTS[a].solid }} onClick={() => patchTheme({ accent: a })} aria-label={a} />)}</div>
          </Field>
        </div>
        <div className="panel-section">
          <div className="section-label">Zaglavlje i podnožje</div>
          <Field label="Header"><TextInput value={doc.headerText || ''} onChange={(e) => patchDoc({ headerText: e.target.value })} /></Field>
          <Field label="Footer"><TextInput value={doc.footerText || ''} onChange={(e) => patchDoc({ footerText: e.target.value })} /></Field>
        </div>
        <div className="panel-note">Kod blokovi su trajno podešeni na <b>light</b> temu radi čitljivosti na projektoru i pri štampi.</div>
      </aside>
    )
  }

  const patch = (value: Block) => onBlockChange(value)

  return (
    <aside className="inspector no-print">
      <div className="panel-title"><div><b>Podešavanja bloka</b><span>{block.type}</span></div>{onClose && <button onClick={onClose}><Icon name="close" size={16} /></button>}</div>

      {block.type === 'text' && <>
        <div className="panel-section">
          <Field label="Tip teksta"><Select value={block.variant} onChange={(e) => patch({ ...block, variant: e.target.value as TextVariant })}><option value="title">Naslov dokumenta</option><option value="subtitle">Podnaslov</option><option value="h1">Naslov 1</option><option value="h2">Naslov 2</option><option value="h3">Naslov 3</option><option value="paragraph">Paragraf</option><option value="quote">Citat / istaknuti tekst</option><option value="caption">Caption</option></Select></Field>
          <Field label="Poravnanje"><Select value={block.align || 'left'} onChange={(e) => patch({ ...block, align: e.target.value as 'left' | 'center' | 'right' })}><option value="left">Levo</option><option value="center">Centar</option><option value="right">Desno</option></Select></Field>
        </div>
        <div className="panel-section">
          <div className="section-label">Inline formatiranje</div>
          <div className="format-row">
            <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold') }}><Icon name="bold" size={16} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic') }}><Icon name="italic" size={16} /></button>
            <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline') }}><Icon name="underline" size={16} /></button>
          </div>
          <small className="muted">Označite deo teksta na stranici, zatim izaberite format.</small>
        </div>
      </>}

      {block.type === 'list' && <div className="panel-section">
        <Field label="Vrsta liste"><Select value={block.ordered ? 'ordered' : 'unordered'} onChange={(e) => patch({ ...block, ordered: e.target.value === 'ordered' })}><option value="unordered">Bullet lista</option><option value="ordered">Numerisana lista</option></Select></Field>
        <div className="section-label">Stavke</div>
        {block.items.map((item, i) => <div className="repeat-row" key={i}><TextInput value={stripHtml(item)} onChange={(e) => { const items = [...block.items]; items[i] = e.target.value; patch({ ...block, items }) }} /><button onClick={() => patch({ ...block, items: block.items.filter((_, j) => j !== i) })}><Icon name="trash" size={14} /></button></div>)}
        <button className="secondary full" onClick={() => patch({ ...block, items: [...block.items, 'Nova stavka'] })}><Icon name="plus" size={14} /> Dodaj stavku</button>
      </div>}

      {block.type === 'code' && <div className="panel-section">
        <Field label="Jezik"><Select value={block.language} onChange={(e) => patch({ ...block, language: e.target.value as CodeLanguage })}><option value="csharp">C#</option><option value="bash">Bash / CLI</option><option value="json">JSON</option><option value="markdown">Markdown</option><option value="typescript">TypeScript</option><option value="text">Text</option></Select></Field>
        <Field label="Caption"><TextInput value={block.caption || ''} onChange={(e) => patch({ ...block, caption: e.target.value })} /></Field>
        <Field label="Kod"><TextArea className="control textarea code-editor-input" value={block.code} rows={15} spellCheck={false} onChange={(e) => patch({ ...block, code: e.target.value })} /></Field>
        <label className="check"><input type="checkbox" checked={!!block.lineNumbers} onChange={(e) => patch({ ...block, lineNumbers: e.target.checked })} /> Brojevi linija</label>
        <div className="panel-note">Prikaz koda je uvek na beloj pozadini sa syntax highlighting-om prilagođenim štampi.</div>
      </div>}

      {block.type === 'callout' && <div className="panel-section">
        <Field label="Tip"><Select value={block.tone} onChange={(e) => patch({ ...block, tone: e.target.value as CalloutTone })}><option value="info">Informacija</option><option value="note">Napomena</option><option value="task">Zadatak / checkpoint</option><option value="warning">Upozorenje</option><option value="success">Rezultat</option></Select></Field>
      </div>}

      {block.type === 'diagram' && <div className="panel-section">
        <Field label="Vrsta dijagrama"><Select value={block.variant} onChange={(e) => patch({ ...block, variant: e.target.value as DiagramVariant })}><option value="flow">Flow</option><option value="timeline">Timeline</option><option value="pipeline">Pipeline</option><option value="stack">Slojevi / stack</option><option value="hub">Hub + specijalisti</option></Select></Field>
        <Field label="Naslov"><TextInput value={block.title || ''} onChange={(e) => patch({ ...block, title: e.target.value })} /></Field>
        {block.variant !== 'stack' && <Field label="Kolone"><Select value={block.columns || 4} onChange={(e) => patch({ ...block, columns: Number(e.target.value) as 2 | 3 | 4 | 5 })}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></Select></Field>}
        <div className="section-label">Elementi</div>
        {block.items.map((item, i) => <div className="diagram-item-editor" key={item.id}>
          <div className="repeat-row"><TextInput value={item.title} onChange={(e) => { const items = [...block.items]; items[i] = { ...item, title: e.target.value }; patch({ ...block, items }) }} /><button onClick={() => patch({ ...block, items: block.items.filter((x) => x.id !== item.id) })}><Icon name="trash" size={14} /></button></div>
          <TextInput value={item.subtitle || ''} placeholder="Podnaslov" onChange={(e) => { const items = [...block.items]; items[i] = { ...item, subtitle: e.target.value }; patch({ ...block, items }) }} />
          <Select value={item.accent || 'blue'} onChange={(e) => { const items = [...block.items]; items[i] = { ...item, accent: e.target.value as Accent }; patch({ ...block, items }) }}>{Object.keys(ACCENTS).map((a) => <option key={a} value={a}>{a}</option>)}</Select>
        </div>)}
        <button className="secondary full" onClick={() => patch({ ...block, items: [...block.items, { id: uid('item'), title: 'Novi korak', subtitle: 'opis', accent: 'blue' }] })}><Icon name="plus" size={14} /> Dodaj element</button>
        <Field label="Tekst ispod"><TextInput value={block.footer || ''} onChange={(e) => patch({ ...block, footer: e.target.value })} /></Field>
      </div>}

      {block.type === 'table' && <div className="panel-section">
        <Field label="Caption"><TextInput value={block.caption || ''} onChange={(e) => patch({ ...block, caption: e.target.value })} /></Field>
        <div className="section-label">Kolone</div>
        {block.headers.map((h, i) => <div className="repeat-row" key={i}><TextInput value={stripHtml(h)} onChange={(e) => { const headers = [...block.headers]; headers[i] = e.target.value; const rows = block.rows.map((r) => { const copy = [...r]; while (copy.length < headers.length) copy.push(''); return copy.slice(0, headers.length) }); patch({ ...block, headers, rows }) }} /><button disabled={block.headers.length <= 1} onClick={() => { const headers = block.headers.filter((_, j) => j !== i); const rows = block.rows.map((r) => r.filter((_, j) => j !== i)); patch({ ...block, headers, rows }) }}><Icon name="trash" size={14} /></button></div>)}
        <button className="secondary full" onClick={() => patch({ ...block, headers: [...block.headers, `Kolona ${block.headers.length + 1}`], rows: block.rows.map((r) => [...r, '']) })}><Icon name="plus" size={14} /> Dodaj kolonu</button>
        <div className="section-label top-gap">Redovi</div>
        {block.rows.map((row, ri) => <div className="table-row-editor" key={ri}>{row.map((cell, ci) => <TextInput key={ci} value={stripHtml(cell)} onChange={(e) => { const rows = block.rows.map((r) => [...r]); rows[ri][ci] = e.target.value; patch({ ...block, rows }) }} />)}<button onClick={() => patch({ ...block, rows: block.rows.filter((_, i) => i !== ri) })}><Icon name="trash" size={14} /></button></div>)}
        <button className="secondary full" onClick={() => patch({ ...block, rows: [...block.rows, block.headers.map(() => '')] })}><Icon name="plus" size={14} /> Dodaj red</button>
      </div>}

      {block.type === 'image' && <div className="panel-section">
        <Field label="Slika"><input type="file" accept="image/*" className="file-input" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => patch({ ...block, src: String(reader.result) }); reader.readAsDataURL(file) }} /></Field>
        <Field label="Caption"><TextInput value={block.caption || ''} onChange={(e) => patch({ ...block, caption: e.target.value })} /></Field>
        <Field label={`Širina: ${block.widthPercent || 100}%`}><input type="range" min="40" max="100" step="5" value={block.widthPercent || 100} onChange={(e) => patch({ ...block, widthPercent: Number(e.target.value) })} /></Field>
      </div>}

      {block.type === 'divider' && <div className="panel-note">Tanka razdelna linija za vizuelno grupisanje sadržaja.</div>}
    </aside>
  )
}

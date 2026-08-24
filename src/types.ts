export type Accent = 'blue' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'
export type DocumentKind = 'praktikum' | 'specifikacija' | 'skripta' | 'dokument'
export type PageSize = 'A4'

export type TextVariant = 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'paragraph' | 'caption' | 'quote'

export type TextBlock = {
  id: string
  type: 'text'
  variant: TextVariant
  html: string
  align?: 'left' | 'center' | 'right'
}

export type ListBlock = {
  id: string
  type: 'list'
  ordered?: boolean
  items: string[]
}

export type CodeLanguage = 'csharp' | 'bash' | 'json' | 'markdown' | 'typescript' | 'text'

export type CodeBlock = {
  id: string
  type: 'code'
  language: CodeLanguage
  code: string
  caption?: string
  lineNumbers?: boolean
}

export type CalloutTone = 'info' | 'note' | 'task' | 'warning' | 'success'

export type CalloutBlock = {
  id: string
  type: 'callout'
  tone: CalloutTone
  title: string
  text: string
}

export type TableBlock = {
  id: string
  type: 'table'
  headers: string[]
  rows: string[][]
  caption?: string
}

export type DiagramItem = {
  id: string
  title: string
  subtitle?: string
  accent?: Accent
}

export type DiagramVariant = 'flow' | 'timeline' | 'stack' | 'hub' | 'pipeline'

export type DiagramBlock = {
  id: string
  type: 'diagram'
  variant: DiagramVariant
  title?: string
  items: DiagramItem[]
  footer?: string
  columns?: 2 | 3 | 4 | 5
}

export type ImageBlock = {
  id: string
  type: 'image'
  src: string
  alt?: string
  caption?: string
  widthPercent?: number
}

export type InstitutionBlock = {
  id: string
  type: 'institution'
  university: string
  faculty: string
  department?: string
  leftLogoSrc?: string
  rightLogoSrc?: string
}

export type DividerBlock = {
  id: string
  type: 'divider'
}

export type Block = TextBlock | ListBlock | CodeBlock | CalloutBlock | TableBlock | DiagramBlock | ImageBlock | InstitutionBlock | DividerBlock

export type DocumentPage = {
  id: string
  label?: string
  layout?: 'standard' | 'cover'
  blocks: Block[]
}

export type DocumentTheme = {
  name: 'Academic Light' | 'Editorial Light' | 'Minimal Light'
  font: 'System' | 'Serif' | 'Humanist'
  accent: Accent
  density: 'comfortable' | 'compact'
  codeTheme: 'light'
  pageSize: PageSize
}

export type CourseDocument = {
  version: 2
  id: string
  title: string
  subtitle?: string
  subject: string
  kind: DocumentKind
  headerText?: string
  footerText?: string
  createdAt: string
  updatedAt: string
  theme: DocumentTheme
  pages: DocumentPage[]
}

export type LibraryEntry = {
  id: string
  title: string
  kind: DocumentKind
  updatedAt: string
}

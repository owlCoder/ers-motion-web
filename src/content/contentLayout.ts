import type { Block, DocumentPage, TextBlock } from '../types'

const TARGET_HEIGHT = 875
const HARD_LIMIT = 1005
const MERGE_LIMIT = 1110
const SPARSE_PAGE = 365
const ORPHAN_PAGE = 250

function plain(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wrappedLines(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil(plain(text).length / charsPerLine))
}

function pagePrefix(prefix: string) {
  return prefix
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

/** Approximate rendered height in the fixed 794x1123 A4 renderer. */
export function blockHeight(block: Block): number {
  switch (block.type) {
    case 'text': {
      const heights: Record<TextBlock['variant'], number> = {
        title: 72,
        subtitle: 46,
        h1: 60,
        h2: 44,
        h3: 36,
        paragraph: 13 + wrappedLines(block.html, 86) * 20,
        caption: 24,
        quote: 52 + wrappedLines(block.html, 76) * 20,
      }
      return heights[block.variant]
    }
    case 'list':
      return 16 + block.items.reduce((height, item) => height + wrappedLines(item, 80) * 19 + 6, 0)
    case 'code':
      return 46 + block.code.split('\n').length * 18 + (block.caption ? 23 : 0)
    case 'callout':
      return 50 + wrappedLines(`${block.title} ${block.text}`, 82) * 18
    case 'table':
      return 46 + Math.max(1, block.rows.length) * 34 + (block.caption ? 23 : 0)
    case 'diagram':
      return (block.variant === 'stack' ? 116 + block.items.length * 60 : 188) + (block.footer ? 23 : 0)
    case 'image':
      return 255 + (block.caption ? 23 : 0)
    case 'institution':
      return 122
    case 'divider':
      return 25
  }
}

function pageHeight(blocks: Block[]) {
  return blocks.reduce((sum, block) => sum + blockHeight(block), 0)
}

function headingText(blocks: Block[]) {
  const heading = blocks.find((block): block is TextBlock => block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant))
  return heading ? plain(heading.html) : undefined
}

function canKeepWithNext(block: Block) {
  return block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)
}

function isSmallClosingBlock(block: Block) {
  if (block.type === 'callout') return block.tone === 'task' || block.tone === 'success' || block.tone === 'note'
  if (block.type === 'list') return block.items.length <= 6
  if (block.type === 'text') return block.variant === 'paragraph' || block.variant === 'caption'
  return false
}

function makePage(blocks: Block[], prefix: string, index: number, continuation: number): DocumentPage {
  const heading = headingText(blocks)
  return {
    id: `reflow-${pagePrefix(prefix)}-${String(index + 1).padStart(2, '0')}`,
    label: heading || `${prefix} — nastavak ${continuation}`,
    layout: 'standard',
    blocks,
  }
}

/**
 * Reflows logical source sections into dense but readable A4 pages.
 * Source page boundaries are editorial hints; physical page breaks are generated
 * from rendered-height estimates and a balancing pass that prevents orphan tasks,
 * short closing lists and headings from occupying almost empty pages.
 */
export function reflowPages(sourcePages: DocumentPage[], prefix: string): DocumentPage[] {
  const blocks = sourcePages.flatMap((page) => page.blocks)
  const result: DocumentPage[] = []
  let current: Block[] = []
  let height = 0
  let continuation = 0

  const flush = () => {
    if (current.length === 0) return
    result.push(makePage(current, prefix, result.length, ++continuation))
    current = []
    height = 0
  }

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    const ownHeight = blockHeight(block)
    const next = blocks[index + 1]
    const keepHeight = canKeepWithNext(block) && next ? ownHeight + Math.min(blockHeight(next), 205) : ownHeight

    if (current.length > 0 && height + ownHeight > HARD_LIMIT) flush()
    if (current.length > 0 && height >= TARGET_HEIGHT && height + keepHeight > HARD_LIMIT) flush()
    if (current.length > 0 && canKeepWithNext(block) && next && height + keepHeight > HARD_LIMIT) flush()

    current.push(block)
    height += ownHeight
  }

  flush()

  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]
    const currentPage = result[index]
    const previousHeight = pageHeight(previous.blocks)
    const currentHeight = pageHeight(currentPage.blocks)
    const onlyClosingMaterial = currentPage.blocks.length <= 3 && currentPage.blocks.every(isSmallClosingBlock)
    const mergeThreshold = onlyClosingMaterial && currentHeight <= ORPHAN_PAGE ? MERGE_LIMIT + 70 : MERGE_LIMIT

    if (currentHeight <= SPARSE_PAGE && previousHeight + currentHeight <= mergeThreshold) {
      previous.blocks.push(...currentPage.blocks)
      result.splice(index, 1)
      index -= 1
    }
  }

  if (result.length > 1) {
    const last = result[result.length - 1]
    const previous = result[result.length - 2]
    const lastHeight = pageHeight(last.blocks)
    if (last.blocks.length <= 2 && last.blocks.every(isSmallClosingBlock) && lastHeight <= ORPHAN_PAGE && pageHeight(previous.blocks) + lastHeight <= MERGE_LIMIT + 100) {
      previous.blocks.push(...last.blocks)
      result.pop()
    }
  }

  const slug = pagePrefix(prefix)
  return result.map((page, index) => ({
    ...page,
    id: `reflow-${slug}-${String(index + 1).padStart(2, '0')}`,
    label: headingText(page.blocks) || `${prefix} — nastavak ${index + 1}`,
  }))
}

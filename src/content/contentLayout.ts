import type { Block, DocumentPage, TextBlock } from '../types'

const TARGET_HEIGHT = 885
const HARD_LIMIT = 1015
const MERGE_LIMIT = 1115
const SPARSE_PAGE = 360
const ORPHAN_PAGE = 245

function plain(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function wrappedLines(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil(plain(text).length / charsPerLine))
}

/** Approximate rendered height in the fixed 794x1123 A4 renderer. */
export function blockHeight(block: Block): number {
  switch (block.type) {
    case 'text': {
      const heights: Record<TextBlock['variant'], number> = {
        title: 70,
        subtitle: 45,
        h1: 58,
        h2: 42,
        h3: 34,
        paragraph: 12 + wrappedLines(block.html, 91) * 18,
        caption: 22,
        quote: 50 + wrappedLines(block.html, 80) * 18,
      }
      return heights[block.variant]
    }
    case 'list':
      return 14 + block.items.reduce((height, item) => height + wrappedLines(item, 84) * 17 + 5, 0)
    case 'code':
      return 44 + block.code.split('\n').length * 16.8 + (block.caption ? 21 : 0)
    case 'callout':
      return 47 + wrappedLines(`${block.title} ${block.text}`, 88) * 16.5
    case 'table':
      return 43 + Math.max(1, block.rows.length) * 31 + (block.caption ? 21 : 0)
    case 'diagram':
      return (block.variant === 'stack' ? 112 + block.items.length * 58 : 180) + (block.footer ? 21 : 0)
    case 'image':
      return 250 + (block.caption ? 21 : 0)
    case 'institution':
      return 120
    case 'divider':
      return 24
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
    id: `reflow-${prefix}-${String(index + 1).padStart(2, '0')}`,
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
    const mergeThreshold = onlyClosingMaterial && currentHeight <= ORPHAN_PAGE ? MERGE_LIMIT + 65 : MERGE_LIMIT

    if (currentHeight <= SPARSE_PAGE && previousHeight + currentHeight <= mergeThreshold) {
      previous.blocks.push(...currentPage.blocks)
      result.splice(index, 1)
      index -= 1
    }
  }

  // Final orphan pass: if the last page contains only a short assignment/outcome,
  // prefer a slightly denser previous page instead of wasting an entire A4 sheet.
  if (result.length > 1) {
    const last = result[result.length - 1]
    const previous = result[result.length - 2]
    const lastHeight = pageHeight(last.blocks)
    if (last.blocks.length <= 2 && last.blocks.every(isSmallClosingBlock) && lastHeight <= ORPHAN_PAGE && pageHeight(previous.blocks) + lastHeight <= MERGE_LIMIT + 95) {
      previous.blocks.push(...last.blocks)
      result.pop()
    }
  }

  return result.map((page, index) => ({
    ...page,
    id: `reflow-${prefix}-${String(index + 1).padStart(2, '0')}`,
    label: headingText(page.blocks) || `${prefix} — nastavak ${index + 1}`,
  }))
}

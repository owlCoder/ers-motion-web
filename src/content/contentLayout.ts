import type { Block, DocumentPage, TextBlock } from '../types'

const TARGET_HEIGHT = 760
const HARD_LIMIT = 900
const MERGE_LIMIT = 940
const SPARSE_PAGE = 315
const ORPHAN_PAGE = 220

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

function tableHeight(block: Extract<Block, { type: 'table' }>) {
  const columns = Math.max(1, block.headers.length || block.rows[0]?.length || 1)
  const charsPerCell = columns <= 2 ? 42 : columns === 3 ? 27 : 20
  const headerLines = block.headers.length
    ? Math.max(...block.headers.map((cell) => wrappedLines(cell, charsPerCell)))
    : 1
  const rows = block.rows.reduce((sum, row) => {
    const lineCount = Math.max(1, ...row.map((cell) => wrappedLines(cell, charsPerCell)))
    return sum + 15 + lineCount * 16
  }, 0)
  return 38 + headerLines * 16 + rows + (block.caption ? 25 : 0)
}

function diagramHeight(block: Extract<Block, { type: 'diagram' }>) {
  if (block.variant === 'stack') return 82 + block.items.length * 72 + (block.footer ? 25 : 0)
  const columns = Math.max(1, block.columns || Math.min(4, block.items.length))
  const rows = Math.max(1, Math.ceil(block.items.length / columns))
  return 82 + rows * 118 + (block.footer ? 25 : 0)
}

/** Approximate rendered height in the fixed 794x1123 A4 renderer. */
export function blockHeight(block: Block): number {
  switch (block.type) {
    case 'text': {
      const heights: Record<TextBlock['variant'], number> = {
        title: 82,
        subtitle: 52,
        h1: 70,
        h2: 50,
        h3: 40,
        paragraph: 16 + wrappedLines(block.html, 82) * 22,
        caption: 28,
        quote: 58 + wrappedLines(block.html, 72) * 21,
      }
      return heights[block.variant]
    }
    case 'list':
      return 20 + block.items.reduce((height, item) => height + wrappedLines(item, 76) * 21 + 7, 0)
    case 'code':
      return 58 + block.code.split('\n').length * 18.5 + (block.caption ? 25 : 0)
    case 'callout':
      return 62 + wrappedLines(`${block.title} ${block.text}`, 76) * 19
    case 'table':
      return tableHeight(block)
    case 'diagram':
      return diagramHeight(block)
    case 'image':
      return 325 + (block.caption ? 25 : 0)
    case 'institution':
      return 138
    case 'divider':
      return 28
  }
}

function pageHeight(blocks: Block[]) {
  return blocks.reduce((sum, block) => sum + blockHeight(block), 0)
}

function headingText(blocks: Block[]) {
  const heading = blocks.find((block): block is TextBlock => block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant))
  return heading ? plain(heading.html) : undefined
}

function isHeading(block: Block) {
  return block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)
}

function isSmallClosingBlock(block: Block) {
  if (block.type === 'callout') return block.tone === 'task' || block.tone === 'success' || block.tone === 'note'
  if (block.type === 'list') return block.items.length <= 6
  if (block.type === 'text') return block.variant === 'paragraph' || block.variant === 'caption'
  return false
}

function keepTogetherHeight(blocks: Block[], index: number) {
  const block = blocks[index]
  if (!isHeading(block)) return blockHeight(block)
  let sum = blockHeight(block)
  const lookAhead = block.type === 'text' && block.variant === 'h2' ? 2 : 1
  for (let offset = 1; offset <= lookAhead; offset += 1) {
    const next = blocks[index + offset]
    if (!next || isHeading(next)) break
    sum += Math.min(blockHeight(next), 260)
  }
  return sum
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

function repairOrphanHeading(previous: DocumentPage, current: DocumentPage) {
  const tail = previous.blocks[previous.blocks.length - 1]
  if (!tail || !isHeading(tail)) return false
  const moved = previous.blocks.pop()!
  current.blocks.unshift(moved)
  return true
}

/**
 * Reflows logical source sections into readable A4 pages.
 * Source page boundaries are editorial hints. Physical page breaks are generated
 * from conservative height estimates and balancing passes that keep headings with
 * their first explanatory blocks and avoid task/checkpoint fragments on isolated pages.
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
    const groupedHeight = keepTogetherHeight(blocks, index)

    if (current.length > 0 && height + ownHeight > HARD_LIMIT) flush()
    if (current.length > 0 && height >= TARGET_HEIGHT && height + groupedHeight > HARD_LIMIT) flush()
    if (current.length > 0 && isHeading(block) && height + groupedHeight > HARD_LIMIT) flush()

    current.push(block)
    height += ownHeight
  }

  flush()

  for (let index = 1; index < result.length; index += 1) {
    repairOrphanHeading(result[index - 1], result[index])
  }

  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]
    const currentPage = result[index]
    const previousHeight = pageHeight(previous.blocks)
    const currentHeight = pageHeight(currentPage.blocks)
    const onlyClosingMaterial = currentPage.blocks.length <= 3 && currentPage.blocks.every(isSmallClosingBlock)
    const mergeThreshold = onlyClosingMaterial && currentHeight <= ORPHAN_PAGE ? MERGE_LIMIT + 55 : MERGE_LIMIT

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
    if (last.blocks.length <= 3 && last.blocks.every(isSmallClosingBlock) && lastHeight <= ORPHAN_PAGE && pageHeight(previous.blocks) + lastHeight <= MERGE_LIMIT + 70) {
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

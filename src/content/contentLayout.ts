import type { Block, DocumentPage, TextBlock } from '../types'

const TARGET_HEIGHT = 640
const HARD_LIMIT = 770
const MERGE_LIMIT = 800
const SPARSE_PAGE = 250
const ORPHAN_PAGE = 175

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
  const charsPerCell = columns <= 2 ? 38 : columns === 3 ? 25 : 18
  const headerLines = block.headers.length
    ? Math.max(...block.headers.map((cell) => wrappedLines(cell, charsPerCell)))
    : 1
  const rows = block.rows.reduce((sum, row) => {
    const lineCount = Math.max(1, ...row.map((cell) => wrappedLines(cell, charsPerCell)))
    return sum + 18 + lineCount * 18
  }, 0)
  return 48 + headerLines * 18 + rows + (block.caption ? 28 : 0)
}

function diagramHeight(block: Extract<Block, { type: 'diagram' }>) {
  if (block.variant === 'stack') return 96 + block.items.length * 78 + (block.footer ? 28 : 0)
  const columns = Math.max(1, block.columns || Math.min(4, block.items.length))
  const rows = Math.max(1, Math.ceil(block.items.length / columns))
  return 96 + rows * 138 + (block.footer ? 28 : 0)
}

/** Approximate rendered height in the fixed 794x1123 A4 renderer. */
export function blockHeight(block: Block): number {
  switch (block.type) {
    case 'text': {
      const heights: Record<TextBlock['variant'], number> = {
        title: 92,
        subtitle: 58,
        h1: 78,
        h2: 58,
        h3: 46,
        paragraph: 22 + wrappedLines(block.html, 76) * 23,
        caption: 32,
        quote: 66 + wrappedLines(block.html, 68) * 22,
      }
      return heights[block.variant]
    }
    case 'list':
      return 24 + block.items.reduce((height, item) => height + wrappedLines(item, 70) * 22 + 8, 0)
    case 'code':
      return 72 + block.code.split('\n').length * 20 + (block.caption ? 28 : 0)
    case 'callout':
      return 78 + wrappedLines(`${block.title} ${block.text}`, 68) * 20
    case 'table':
      return tableHeight(block)
    case 'diagram':
      return diagramHeight(block)
    case 'image':
      return 405 + (block.caption ? 28 : 0)
    case 'institution':
      return 148
    case 'divider':
      return 32
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
  if (block.type === 'list') return block.items.length <= 5
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
    sum += Math.min(blockHeight(next), 300)
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

function moveTrailingClosingBlock(previous: DocumentPage, current: DocumentPage) {
  const first = current.blocks[0]
  if (!first || !isSmallClosingBlock(first)) return false
  const previousHeight = pageHeight(previous.blocks)
  const candidateHeight = blockHeight(first)
  if (previousHeight + candidateHeight > MERGE_LIMIT) return false
  previous.blocks.push(first)
  current.blocks.shift()
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
    if (moveTrailingClosingBlock(previous, currentPage) && currentPage.blocks.length === 0) {
      result.splice(index, 1)
      index -= 1
    }
  }

  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]
    const currentPage = result[index]
    const previousHeight = pageHeight(previous.blocks)
    const currentHeight = pageHeight(currentPage.blocks)
    const onlyClosingMaterial = currentPage.blocks.length <= 3 && currentPage.blocks.every(isSmallClosingBlock)
    const mergeThreshold = onlyClosingMaterial && currentHeight <= ORPHAN_PAGE ? MERGE_LIMIT + 20 : MERGE_LIMIT

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
    if (last.blocks.length <= 3 && last.blocks.every(isSmallClosingBlock) && lastHeight <= ORPHAN_PAGE && pageHeight(previous.blocks) + lastHeight <= MERGE_LIMIT + 30) {
      previous.blocks.push(...last.blocks)
      result.pop()
    }
  }

  const slug = pagePrefix(prefix)
  return result
    .filter((page) => page.blocks.length > 0)
    .map((page, index) => ({
      ...page,
      id: `reflow-${slug}-${String(index + 1).padStart(2, '0')}`,
      label: headingText(page.blocks) || `${prefix} — nastavak ${index + 1}`,
    }))
}

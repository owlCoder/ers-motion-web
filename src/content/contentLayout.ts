import type { Block, DocumentPage, TextBlock } from '../types'

// The previous estimator was intentionally too conservative and produced a 111-page
// practicum with many pages using only one third of the available A4 body. These values
// are calibrated against the actual fixed 794x1123 renderer and leave a safety margin
// above the footer while still allowing related material to stay together.
const HEIGHT_SCALE = 0.68
const TARGET_HEIGHT = 690
const HARD_LIMIT = 835
const MERGE_LIMIT = 860
const SPARSE_PAGE = 360
const ORPHAN_PAGE = 235

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
  const charsPerCell = columns <= 2 ? 42 : columns === 3 ? 28 : 21
  const headerLines = block.headers.length
    ? Math.max(...block.headers.map((cell) => wrappedLines(cell, charsPerCell)))
    : 1
  const rows = block.rows.reduce((sum, row) => {
    const lineCount = Math.max(1, ...row.map((cell) => wrappedLines(cell, charsPerCell)))
    return sum + 16 + lineCount * 17
  }, 0)
  return 42 + headerLines * 17 + rows + (block.caption ? 24 : 0)
}

function diagramHeight(block: Extract<Block, { type: 'diagram' }>) {
  if (block.variant === 'stack') return 82 + block.items.length * 66 + (block.footer ? 24 : 0)
  const columns = Math.max(1, block.columns || Math.min(4, block.items.length))
  const rows = Math.max(1, Math.ceil(block.items.length / columns))
  return 84 + rows * 118 + (block.footer ? 24 : 0)
}

function rawBlockHeight(block: Block): number {
  switch (block.type) {
    case 'text': {
      const heights: Record<TextBlock['variant'], number> = {
        title: 88,
        subtitle: 52,
        h1: 70,
        h2: 52,
        h3: 42,
        paragraph: 18 + wrappedLines(block.html, 82) * 21,
        caption: 28,
        quote: 58 + wrappedLines(block.html, 74) * 20,
      }
      return heights[block.variant]
    }
    case 'list':
      return 18 + block.items.reduce((height, item) => height + wrappedLines(item, 76) * 20 + 6, 0)
    case 'code':
      return 62 + block.code.split('\n').length * 18 + (block.caption ? 24 : 0)
    case 'callout':
      return 66 + wrappedLines(`${block.title} ${block.text}`, 74) * 18
    case 'table':
      return tableHeight(block)
    case 'diagram':
      return diagramHeight(block)
    case 'image':
      return 350 + (block.caption ? 24 : 0)
    case 'institution':
      return 132
    case 'divider':
      return 26
  }
}

/** Approximate rendered height in the fixed 794x1123 A4 renderer. */
export function blockHeight(block: Block): number {
  return Math.ceil(rawBlockHeight(block) * HEIGHT_SCALE)
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
    sum += Math.min(blockHeight(next), 250)
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

function candidateCount(page: DocumentPage) {
  const first = page.blocks[0]
  if (!first) return 0
  if (!isHeading(first)) return 1
  const second = page.blocks[1]
  return second && !isHeading(second) ? 2 : 1
}

function pullForward(previous: DocumentPage, current: DocumentPage) {
  if (current.blocks.length === 0) return false
  const count = candidateCount(current)
  const candidate = current.blocks.slice(0, count)
  const candidateHeight = pageHeight(candidate)
  if (pageHeight(previous.blocks) + candidateHeight > MERGE_LIMIT) return false
  previous.blocks.push(...candidate)
  current.blocks.splice(0, count)
  return true
}

/**
 * Reflows logical source sections into readable A4 pages. Source page boundaries are
 * editorial hints only. The balancing pass fills the available A4 body, keeps headings
 * with their first explanatory block and avoids isolated task/checkpoint fragments.
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

  // Repeatedly pull complete blocks (or a heading with its first block) back to the
  // previous page while there is real space. This is the key pass that removes pages
  // containing only one callout, one short table or a handful of bullets.
  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]
    const currentPage = result[index]
    while (pullForward(previous, currentPage)) {
      if (currentPage.blocks.length === 0) break
    }
    if (currentPage.blocks.length === 0) {
      result.splice(index, 1)
      index -= 1
    }
  }

  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]
    const currentPage = result[index]
    const previousHeight = pageHeight(previous.blocks)
    const currentHeight = pageHeight(currentPage.blocks)
    const onlyClosingMaterial = currentPage.blocks.length <= 4 && currentPage.blocks.every(isSmallClosingBlock)
    const mergeThreshold = onlyClosingMaterial && currentHeight <= ORPHAN_PAGE ? MERGE_LIMIT + 25 : MERGE_LIMIT

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
    if (last.blocks.length <= 4 && last.blocks.every(isSmallClosingBlock) && lastHeight <= ORPHAN_PAGE && pageHeight(previous.blocks) + lastHeight <= MERGE_LIMIT + 35) {
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

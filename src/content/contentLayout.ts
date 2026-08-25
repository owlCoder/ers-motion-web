import type { Block, DocumentPage, TextBlock } from '../types'

const TARGET_HEIGHT = 900
const HARD_LIMIT = 982
const MERGE_LIMIT = 1008
const SPARSE_PAGE = 285

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
        h2: 43,
        h3: 35,
        paragraph: 14 + wrappedLines(block.html, 88) * 19,
        caption: 24,
        quote: 55 + wrappedLines(block.html, 78) * 19,
      }
      return heights[block.variant]
    }
    case 'list':
      return 18 + block.items.reduce((height, item) => height + wrappedLines(item, 78) * 18 + 7, 0)
    case 'code':
      return 54 + block.code.split('\n').length * 17 + 24
    case 'callout':
      return 55 + wrappedLines(`${block.title} ${block.text}`, 82) * 17
    case 'table':
      return 52 + Math.max(1, block.rows.length) * 36 + 24
    case 'diagram':
      return (block.variant === 'stack' ? 125 + block.items.length * 63 : 195) + 24
    case 'image':
      return 315 + 24
    case 'institution':
      return 125
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

function canKeepWithNext(block: Block) {
  return block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)
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
 * from rendered-height estimates and a final sparse-page balancing pass.
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
    const keepHeight = canKeepWithNext(block) && next ? ownHeight + Math.min(blockHeight(next), 210) : ownHeight

    if (current.length > 0 && height + ownHeight > HARD_LIMIT) flush()

    if (current.length > 0 && height >= TARGET_HEIGHT && height + keepHeight > HARD_LIMIT) flush()

    if (current.length > 0 && canKeepWithNext(block) && next && height + keepHeight > HARD_LIMIT) flush()

    current.push(block)
    height += ownHeight
  }

  flush()

  // If a callout, short list or closing paragraph was pushed to a nearly empty
  // continuation page, pull it back when the previous page still has real space.
  for (let index = 1; index < result.length; index += 1) {
    const previous = result[index - 1]
    const currentPage = result[index]
    const previousHeight = pageHeight(previous.blocks)
    const currentHeight = pageHeight(currentPage.blocks)
    if (currentHeight <= SPARSE_PAGE && previousHeight + currentHeight <= MERGE_LIMIT) {
      previous.blocks.push(...currentPage.blocks)
      result.splice(index, 1)
      index -= 1
    }
  }

  return result.map((page, index) => ({
    ...page,
    id: `reflow-${prefix}-${String(index + 1).padStart(2, '0')}`,
    label: headingText(page.blocks) || `${prefix} — nastavak ${index + 1}`,
  }))
}
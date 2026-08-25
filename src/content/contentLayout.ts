import type { Block, DocumentPage, TextBlock } from '../types'

const TARGET_HEIGHT = 835
const HARD_LIMIT = 930

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
      return 50 + block.code.split('\n').length * 17 + (block.caption ? 24 : 0)
    case 'callout':
      return 55 + wrappedLines(`${block.title} ${block.text}`, 82) * 17
    case 'table':
      return 52 + Math.max(1, block.rows.length) * 36 + (block.caption ? 24 : 0)
    case 'diagram':
      return block.variant === 'stack' ? 125 + block.items.length * 63 : 195 + (block.footer ? 20 : 0)
    case 'image':
      return 315 + (block.caption ? 24 : 0)
    case 'institution':
      return 125
    case 'divider':
      return 28
  }
}

function headingText(blocks: Block[]) {
  const heading = blocks.find((block): block is TextBlock => block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant))
  return heading ? plain(heading.html) : undefined
}

function canKeepWithNext(block: Block) {
  return block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)
}

/**
 * Reflows logical source pages into physically fuller A4 pages.
 * Source page boundaries are treated as editorial hints rather than forced page breaks.
 * A chapter can still be reflowed independently to start it on a fresh page.
 */
export function reflowPages(sourcePages: DocumentPage[], prefix: string): DocumentPage[] {
  const blocks = sourcePages.flatMap((page) => page.blocks)
  const result: DocumentPage[] = []
  let current: Block[] = []
  let height = 0
  let continuation = 0

  const flush = () => {
    if (current.length === 0) return
    const heading = headingText(current)
    result.push({
      id: `reflow-${prefix}-${String(result.length + 1).padStart(2, '0')}`,
      label: heading || `${prefix} — nastavak ${++continuation}`,
      layout: 'standard',
      blocks: current,
    })
    current = []
    height = 0
  }

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    const ownHeight = blockHeight(block)
    const next = blocks[index + 1]
    const keepHeight = canKeepWithNext(block) && next ? ownHeight + Math.min(blockHeight(next), 180) : ownHeight

    if (current.length > 0 && (height + ownHeight > HARD_LIMIT || (height >= TARGET_HEIGHT && height + keepHeight > HARD_LIMIT))) {
      flush()
    }

    // Avoid leaving a heading alone at the bottom of a page.
    if (current.length > 0 && canKeepWithNext(block) && next && height + keepHeight > HARD_LIMIT) {
      flush()
    }

    current.push(block)
    height += ownHeight
  }

  flush()
  return result
}

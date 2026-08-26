import { useEffect, useRef } from 'react'

function semanticTag(className?: string): 'h1' | 'h2' | 'h3' | 'p' | 'div' {
  if (className?.includes('text-h1')) return 'h1'
  if (className?.includes('text-h2')) return 'h2'
  if (className?.includes('text-h3')) return 'h3'
  if (className?.includes('text-paragraph')) return 'p'
  return 'div'
}

export function EditableText({ html, className, onChange, onFocus, placeholder }: { html: string; className?: string; onChange: (html: string) => void; onFocus?: () => void; placeholder?: string }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) ref.current.innerHTML = html
  }, [html])

  const setRef = (node: HTMLElement | null) => { ref.current = node }
  const props = {
    className,
    contentEditable: true,
    suppressContentEditableWarning: true,
    'data-placeholder': placeholder || 'Unesite tekst…',
    onFocus,
    onBlur: () => onChange(ref.current?.innerHTML || ''),
  }

  switch (semanticTag(className)) {
    case 'h1': return <h1 ref={setRef} {...props} />
    case 'h2': return <h2 ref={setRef} {...props} />
    case 'h3': return <h3 ref={setRef} {...props} />
    case 'p': return <p ref={setRef} {...props} />
    default: return <div ref={setRef} {...props} />
  }
}

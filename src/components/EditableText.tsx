import { createElement, useEffect, useRef } from 'react'

function semanticTag(className?: string) {
  if (className?.includes('text-h1')) return 'h1'
  if (className?.includes('text-h2')) return 'h2'
  if (className?.includes('text-h3')) return 'h3'
  if (className?.includes('text-paragraph')) return 'p'
  return 'div'
}

export function EditableText({ html, className, onChange, onFocus, placeholder }: { html: string; className?: string; onChange: (html: string) => void; onFocus?: () => void; placeholder?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) ref.current.innerHTML = html
  }, [html])

  return createElement(semanticTag(className), {
    ref,
    className,
    contentEditable: true,
    suppressContentEditableWarning: true,
    'data-placeholder': placeholder || 'Unesite tekst…',
    onFocus,
    onBlur: () => onChange(ref.current?.innerHTML || ''),
  })
}

import { useEffect, useRef } from 'react'

export function EditableText({ html, className, onChange, onFocus, placeholder }: { html: string; className?: string; onChange: (html: string) => void; onFocus?: () => void; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) ref.current.innerHTML = html
  }, [html])

  return (
    <div
      ref={ref}
      className={className}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder || 'Unesite tekst…'}
      onFocus={onFocus}
      onBlur={() => onChange(ref.current?.innerHTML || '')}
    />
  )
}

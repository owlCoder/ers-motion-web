import type { SVGProps } from 'react'

type Name = 'menu' | 'file' | 'folder' | 'plus' | 'save' | 'open' | 'print' | 'play' | 'settings' | 'trash' | 'copy' | 'up' | 'down' | 'code' | 'image' | 'table' | 'diagram' | 'text' | 'list' | 'note' | 'divider' | 'chevron' | 'close' | 'bold' | 'italic' | 'underline' | 'undo' | 'redo'

const paths: Record<Name, React.ReactNode> = {
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5" /></>,
  folder: <><path d="M3 6h7l2 2h9v11H3z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  save: <><path d="M5 3h13l3 3v15H3V3z" /><path d="M7 3v6h9V3M7 21v-8h10v8" /></>,
  open: <><path d="M3 7h7l2 2h9l-3 10H5z" /><path d="M3 7V4h7l2 2h6v3" /></>,
  print: <><path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></>,
  play: <><path d="m8 5 11 7-11 7z" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05-2.12 2.12-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V21h-3v-.59a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-2 .36l-.05.05-2.12-2.12.05-.05a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 5.03 14H4.5v-3h.53a1.8 1.8 0 0 0 1.65-1.1 1.8 1.8 0 0 0-.36-2l-.05-.05 2.12-2.12.05.05a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 11.54 4.5V4h3v.5a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.05-.05 2.12 2.12-.05.05a1.8 1.8 0 0 0-.36 2A1.8 1.8 0 0 0 21 11h.5v3H21a1.8 1.8 0 0 0-1.6 1z" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  up: <><path d="m6 14 6-6 6 6" /></>,
  down: <><path d="m6 10 6 6 6-6" /></>,
  code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 15-5-5L5 20" /></>,
  table: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9h18M9 4v16M15 4v16" /></>,
  diagram: <><rect x="3" y="4" width="6" height="5" rx="1" /><rect x="15" y="4" width="6" height="5" rx="1" /><rect x="9" y="15" width="6" height="5" rx="1" /><path d="M6 9v3h6M18 9v3h-6M12 12v3" /></>,
  text: <><path d="M4 5h16M12 5v14M8 19h8" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  note: <><path d="M4 4h16v16H4z" /><path d="M8 9h8M8 13h8" /></>,
  divider: <><path d="M3 12h18" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  bold: <><path d="M8 4h5a4 4 0 0 1 0 8H8zM8 12h6a4 4 0 0 1 0 8H8z" /></>,
  italic: <><path d="M10 4h8M6 20h8M14 4 10 20" /></>,
  underline: <><path d="M7 4v7a5 5 0 0 0 10 0V4M5 21h14" /></>,
  undo: <><path d="M9 7 4 12l5 5" /><path d="M5 12h8a6 6 0 0 1 6 6" /></>,
  redo: <><path d="m15 7 5 5-5 5" /><path d="M19 12h-8a6 6 0 0 0-6 6" /></>,
}

export function Icon({ name, size = 18, ...props }: SVGProps<SVGSVGElement> & { name: Name; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}

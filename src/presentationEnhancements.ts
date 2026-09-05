import './presentation-fullscreen.css'

function setupPresentationView() {
  const hero = document.querySelector<HTMLElement>('.presentations-hero')
  const eyebrow = hero?.querySelector<HTMLElement>('.eyebrow')
  const description = hero?.querySelector<HTMLParagraphElement>('p')

  if (eyebrow) eyebrow.textContent = 'Materijal za vežbe'
  if (description) {
    description.textContent = 'Javne prezentacije prate osam vežbi iz praktikuma. Svaka prezentacija ima deset slajdova namenjenih neposrednom prikazu studentima tokom časa.'
  }

  document.querySelectorAll<HTMLElement>('.speaker-note').forEach((note) => note.remove())

  const stage = document.querySelector<HTMLElement>('.deck-stage')
  const toolbar = stage?.querySelector<HTMLElement>('.deck-toolbar')
  if (!stage || !toolbar || toolbar.querySelector('.fullscreen-button')) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'fullscreen-button'
  button.textContent = 'Ceo ekran'
  button.setAttribute('aria-label', 'Otvori prezentaciju preko celog ekrana')

  const updateButton = () => {
    const active = document.fullscreenElement === stage
    button.textContent = active ? 'Izađi iz celog ekrana' : 'Ceo ekran'
    button.setAttribute('aria-label', active ? 'Izađi iz prikaza preko celog ekrana' : 'Otvori prezentaciju preko celog ekrana')
  }

  button.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === stage) {
        await document.exitFullscreen()
      } else if (stage.requestFullscreen) {
        await stage.requestFullscreen()
      }
    } finally {
      updateButton()
    }
  })

  document.addEventListener('fullscreenchange', updateButton)
  toolbar.appendChild(button)
}

function installPresentationEnhancements() {
  setupPresentationView()

  const observer = new MutationObserver(() => setupPresentationView())
  observer.observe(document.body, { childList: true, subtree: true })

  window.addEventListener('keydown', (event) => {
    const stage = document.querySelector<HTMLElement>('.deck-stage')
    if (!stage || document.fullscreenElement !== stage) return

    const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>('.slide-controls button'))
    const previous = buttons[0]
    const next = buttons[1]

    if (event.key === 'PageUp') {
      event.preventDefault()
      previous?.click()
    }
    if (event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault()
      next?.click()
    }
  })
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installPresentationEnhancements, { once: true })
  } else {
    installPresentationEnhancements()
  }
}

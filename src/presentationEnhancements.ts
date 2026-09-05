import './presentation-fullscreen.css'

function updatePublicPresentationText() {
  const hero = document.querySelector<HTMLElement>('.presentations-hero')
  const eyebrow = hero?.querySelector<HTMLElement>('.eyebrow')
  const description = hero?.querySelector<HTMLParagraphElement>('p')

  if (eyebrow && eyebrow.textContent !== 'Materijal za vežbe') {
    eyebrow.textContent = 'Materijal za vežbe'
  }

  const publicDescription = 'Javne prezentacije prate osam vežbi iz praktikuma. Svaka prezentacija ima deset slajdova namenjenih neposrednom prikazu studentima tokom časa.'
  if (description && description.textContent !== publicDescription) {
    description.textContent = publicDescription
  }
}

function updateFullscreenButton(button: HTMLButtonElement, stage: HTMLElement) {
  const active = document.fullscreenElement === stage
  button.textContent = active ? 'Izađi iz celog ekrana' : 'Ceo ekran'
  button.setAttribute(
    'aria-label',
    active ? 'Izađi iz prikaza preko celog ekrana' : 'Otvori prezentaciju preko celog ekrana',
  )
}

function ensurePresentationControls() {
  updatePublicPresentationText()
  document.querySelectorAll<HTMLElement>('.speaker-note').forEach((note) => note.remove())

  const stage = document.querySelector<HTMLElement>('.deck-stage')
  const toolbar = stage?.querySelector<HTMLElement>('.deck-toolbar')
  if (!stage || !toolbar) return

  let button = toolbar.querySelector<HTMLButtonElement>('.fullscreen-button')
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.className = 'fullscreen-button'

    button.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement === stage) {
          await document.exitFullscreen()
        } else if (stage.requestFullscreen) {
          await stage.requestFullscreen()
        }
      } catch {
        // Browser može odbiti fullscreen ako korisnička akcija nije dostupna.
      } finally {
        updateFullscreenButton(button!, stage)
      }
    })

    toolbar.appendChild(button)
  }

  updateFullscreenButton(button, stage)
}

function scheduleControlsRefresh() {
  window.setTimeout(ensurePresentationControls, 0)
}

function installPresentationEnhancements() {
  ensurePresentationControls()

  // React menja sadržaj taba bez ponovnog učitavanja stranice. Posle korisničke
  // akcije proveravamo samo da li kontrola za ceo ekran postoji. Nema posmatranja
  // celog DOM stabla, pa nema mogućnosti za rekurzivno aktiviranje izmena.
  document.addEventListener('click', scheduleControlsRefresh)
  window.addEventListener('hashchange', scheduleControlsRefresh)
  document.addEventListener('fullscreenchange', ensurePresentationControls)

  window.addEventListener('keydown', (event) => {
    const stage = document.querySelector<HTMLElement>('.deck-stage')
    if (!stage || document.fullscreenElement !== stage) return

    const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>('.slide-controls button'))
    const previous = buttons[0]
    const next = buttons[1]

    if (event.key === 'PageUp') {
      event.preventDefault()
      previous?.click()
      scheduleControlsRefresh()
    }

    if (event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault()
      next?.click()
      scheduleControlsRefresh()
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

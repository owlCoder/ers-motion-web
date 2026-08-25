import type { CourseDocument } from '../types'
import { projectSpec2026 } from './canvaProjectSpec'
import { reflowPages } from './contentLayout'

export const projectSpec2026Reflowed: CourseDocument = {
  ...projectSpec2026,
  updatedAt: '2026-08-25T20:45:00.000Z',
  pages: [
    projectSpec2026.pages[0],
    ...reflowPages(projectSpec2026.pages.slice(1), 'Projektna specifikacija'),
  ],
}

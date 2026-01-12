export const APP_NAME = 'Dinnartec Dashboard'

export const VERTICALS = {
  CORE: 'core',
  SOLUTIONS: 'solutions',
  FACTORY: 'factory',
  LABS: 'labs',
} as const

export const PROJECT_STATUSES = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  LAUNCHED: 'launched',
  ARCHIVED: 'archived',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const

export const TEAM_ROLES = {
  LEAD: 'lead',
  MEMBER: 'member',
} as const

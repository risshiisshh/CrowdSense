import { CrowdLevel } from '../types'

export function getZoneColor(level: CrowdLevel): string {
  switch (level) {
    case 'low':    return '#10B981'
    case 'medium': return '#F59E0B'
    case 'high':   return '#FF6B6B'
    case 'full':   return '#EF4444'
  }
}

export function getZoneFill(level: CrowdLevel): string {
  switch (level) {
    case 'low':    return 'rgba(16, 185, 129, 0.18)'
    case 'medium': return 'rgba(245, 158, 11, 0.18)'
    case 'high':   return 'rgba(255, 107, 107, 0.20)'
    case 'full':   return 'rgba(239, 68, 68, 0.22)'
  }
}

export function getZoneBorder(level: CrowdLevel): string {
  switch (level) {
    case 'low':    return 'rgba(16, 185, 129, 0.5)'
    case 'medium': return 'rgba(245, 158, 11, 0.5)'
    case 'high':   return 'rgba(255, 107, 107, 0.5)'
    case 'full':   return 'rgba(239, 68, 68, 0.6)'
  }
}

export function getZoneStatus(level: CrowdLevel): string {
  switch (level) {
    case 'low':    return 'Comfortable'
    case 'medium': return 'Moderate'
    case 'high':   return 'Crowded'
    case 'full':   return 'Packed'
  }
}

export function getWaitBadgeColor(minutes: number): string {
  if (minutes <= 5)  return '#10B981'
  if (minutes <= 15) return '#F59E0B'
  if (minutes <= 25) return '#FF6B6B'
  return '#EF4444'
}

export function formatWait(minutes: number): string {
  if (minutes === 0) return 'No wait'
  if (minutes < 60)  return `${minutes}m wait`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m wait`
}

export function getOccupancyPercent(occupancy: number, capacity: number): number {
  return Math.min(100, Math.round((occupancy / capacity) * 100))
}

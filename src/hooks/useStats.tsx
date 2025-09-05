import { useEffect, useMemo, useState } from 'react'
import { Signalement, SignalementStatsDTO, StatsService } from '../api/signalement'

type SunburstData = {
  name: string
  value?: number
  children?: SunburstData[]
}

const labelMap = {
  [Signalement.status.PENDING]: 'En attente',
  [Signalement.status.PROCESSED]: 'Traités',
  [Signalement.status.IGNORED]: 'Ignorés',
  [Signalement.status.EXPIRED]: 'Expirés',
}

const getChildren = (data?: Record<string, any>): SunburstData[] => {
  if (!data) return []
  return Object.entries(data).map(([key, value]) => {
    const name = labelMap[key as Signalement.status] || key
    if (typeof value === 'object' && value !== null) {
      const children = getChildren(value as Record<string, any>)
      const valueSum = children.reduce((sum, child) => sum + (child.value || 0), 0)
      return {
        name,
        children,
        value: valueSum,
      }
    } else {
      return {
        name,
        value: Number(value),
      }
    }
  })
}

export function useStats() {
  const [rawStats, setRawStats] = useState<SignalementStatsDTO | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await StatsService.getStats()
        setRawStats(stats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const totals = useMemo(() => {
    if (!rawStats) return null

    return Object.values(rawStats.fromSources).reduce(
      (acc, source) => {
        Object.entries(source).forEach(([status, count]) => {
          if (!acc[status]) {
            acc[status] = 0
          }

          acc[status] += parseInt(count as string)
        })
        return acc
      },
      {} as Record<Signalement.status, number>,
    )
  }, [rawStats])

  const sourceChartData = useMemo(
    () => ({
      children: getChildren(rawStats?.fromSources),
    }),
    [rawStats],
  )

  const clientChartData = useMemo(
    () => ({
      children: getChildren(rawStats?.processedBy),
    }),
    [rawStats],
  )

  const stats = rawStats
    ? {
        total: rawStats.total,
        totalPending: totals ? totals[Signalement.status.PENDING] : 0,
        totalIgnored: totals ? totals[Signalement.status.IGNORED] : 0,
        totalProcessed: totals ? totals[Signalement.status.PROCESSED] : 0,
        totalExpired: totals ? totals[Signalement.status.EXPIRED] : 0,
        sourceChartData,
        clientChartData,
      }
    : null

  return stats
}

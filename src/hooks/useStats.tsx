import { useEffect, useMemo, useState } from 'react'
import { CombinedStatsDTO, Signalement, StatsService } from '../api/signalement'

type SunburstData = {
  name: string
  value?: number
  children?: SunburstData[]
}

type ChartData = {
  children: SunburstData[]
}

type StatusKey = Signalement.status

type StatByStatus = Record<StatusKey, number>

type StatsGroupRaw = {
  total?: number | string
  fromSources?: Record<string, Record<string, number | string>>
  processedBy?: Record<string, Record<string, number | string>>
  byMonth?: CombinedStatsDTO['signalementStats']['byMonth']
}

type StatsOutput = {
  total: number
  totalPending: number
  totalIgnored: number
  totalProcessed: number
  totalExpired: number
  sourceChartData: ChartData
  clientChartData: ChartData
  byMonth: CombinedStatsDTO['signalementStats']['byMonth']
  byMonthStacked: CombinedStatsDTO['signalementStats']['byMonth']
}

const labelMap = {
  [Signalement.status.PENDING]: 'En attente',
  [Signalement.status.PROCESSED]: 'Traités',
  [Signalement.status.IGNORED]: 'Ignorés',
  [Signalement.status.EXPIRED]: 'Expirés',
}

const byMonthTypeLabelMap: Record<string, string> = {
  created: 'Créés',
  processed: 'Traités',
}

const emptyTotals: StatByStatus = {
  [Signalement.status.PENDING]: 0,
  [Signalement.status.IGNORED]: 0,
  [Signalement.status.PROCESSED]: 0,
  [Signalement.status.EXPIRED]: 0,
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

const normalizeNumber = (value: number | string | undefined): number => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return parseInt(value, 10) || 0
  }

  return 0
}

const computeTotals = (
  fromSources?: Record<string, Record<string, number | string>>,
): StatByStatus => {
  if (!fromSources) {
    return { ...emptyTotals }
  }

  return Object.values(fromSources).reduce<StatByStatus>(
    (acc, source) => {
      Object.entries(source).forEach(([status, count]) => {
        if (status in acc) {
          acc[status as StatusKey] = acc[status as StatusKey] + normalizeNumber(count)
        }
      })
      return acc
    },
    { ...emptyTotals },
  )
}

const buildStats = (group?: StatsGroupRaw): StatsOutput | null => {
  if (!group) {
    return null
  }

  const totals = computeTotals(group.fromSources)
  return {
    total: normalizeNumber(group.total),
    totalPending: totals[Signalement.status.PENDING],
    totalIgnored: totals[Signalement.status.IGNORED],
    totalProcessed: totals[Signalement.status.PROCESSED],
    totalExpired: totals[Signalement.status.EXPIRED],
    sourceChartData: {
      children: getChildren(group.fromSources),
    },
    clientChartData: {
      children: getChildren(group.processedBy),
    },
    byMonth: (group.byMonth || []).map((entry: Record<string, any>) => ({
      ...entry,
      type: byMonthTypeLabelMap[entry.type] || entry.type,
    })),
    byMonthStacked: (group.byMonth || []).reduce(
      (
        acc: Array<{ type: string; date: string; count: number }>,
        cur: { type: string; date: string; count: number },
        index: number,
      ) => {
        const prev = acc[index - 2]

        if (!prev) {
          return [
            ...acc,
            {
              ...cur,
              type: byMonthTypeLabelMap[cur.type] || cur.type,
            },
          ]
        }

        return [
          ...acc,
          {
            ...cur,
            type: byMonthTypeLabelMap[cur.type] || cur.type + '(cumulé)',
            count: cur.count + prev.count,
          },
        ]
      },
      [],
    ),
  }
}

export function useStats() {
  const [isLoading, setIsLoading] = useState(true)
  const [rawStats, setRawStats] = useState<CombinedStatsDTO | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await StatsService.getStats()
        setRawStats(stats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const signalementStats = useMemo(
    () => buildStats(rawStats?.signalementStats as StatsGroupRaw | undefined),
    [rawStats],
  )

  const alertStats = useMemo(
    () => buildStats(rawStats?.alertStats as StatsGroupRaw | undefined),
    [rawStats],
  )

  return { signalementStats, alertStats, isLoading }
}

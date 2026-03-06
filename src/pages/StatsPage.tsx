import React from 'react'
import styled from 'styled-components'
import { Sunburst } from '@ant-design/plots'
import { useStats } from '../hooks/useStats'
import { CountStat } from '../composants/stats/CountStat'
import Loader from '../composants/common/Loader'
import Tabs from '@codegouvfr/react-dsfr/Tabs'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  section {
    margin-top: 1rem;

    > .wrapper {
      gap: 1rem;
      justify-content: space-around;
      display: flex;
      flex-wrap: wrap;
    }
  }
`

export function StatsPage() {
  const { signalementStats, alertStats, isLoading } = useStats()

  return (
    <StyledWrapper>
      <h1>Tableau de bord statistiques</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <Tabs
          tabs={[
            {
              label: 'Signalements',
              isDefault: true,
              content: signalementStats ? (
                <>
                  <h2>Signalements</h2>
                  <section>
                    <div className='wrapper'>
                      <CountStat label='Total' count={signalementStats.total} />
                      <CountStat label='En attente' count={signalementStats.totalPending} />
                      <CountStat label='Traités' count={signalementStats.totalProcessed} />
                      <CountStat label='Ignorés' count={signalementStats.totalIgnored} />
                      <CountStat label='Expirés' count={signalementStats.totalExpired} />
                    </div>
                  </section>

                  <section>
                    <Sunburst
                      data={signalementStats.sourceChartData}
                      animate={{
                        enter: { type: 'waveIn' },
                      }}
                      innerRadius={0.2}
                      title={{
                        title: 'Créations par sources',
                        titleFontSize: 22,
                      }}
                    />
                    <Sunburst
                      data={signalementStats.clientChartData}
                      animate={{
                        enter: { type: 'waveIn' },
                      }}
                      innerRadius={0.2}
                      title={{
                        title: 'Traitements par clients',
                        titleFontSize: 22,
                      }}
                    />
                  </section>
                </>
              ) : null,
            },
            {
              label: 'Alertes',
              content: alertStats ? (
                <>
                  <h2>Alertes</h2>
                  <section>
                    <div className='wrapper'>
                      <CountStat label='Total' count={alertStats.total} />
                      <CountStat label='En attente' count={alertStats.totalPending} />
                      <CountStat label='Traités' count={alertStats.totalProcessed} />
                      <CountStat label='Ignorés' count={alertStats.totalIgnored} />
                    </div>
                  </section>
                  <section>
                    <Sunburst
                      data={alertStats.sourceChartData}
                      animate={{
                        enter: { type: 'waveIn' },
                      }}
                      innerRadius={0.2}
                      title={{
                        title: 'Créations par sources',
                        titleFontSize: 22,
                      }}
                    />
                    <Sunburst
                      data={alertStats.clientChartData}
                      animate={{
                        enter: { type: 'waveIn' },
                      }}
                      innerRadius={0.2}
                      title={{
                        title: 'Traitements par clients',
                        titleFontSize: 22,
                      }}
                    />
                  </section>
                </>
              ) : null,
            },
          ]}
        />
      )}
    </StyledWrapper>
  )
}

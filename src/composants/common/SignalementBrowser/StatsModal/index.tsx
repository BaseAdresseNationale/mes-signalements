import React from 'react'
import Modal from '../../Modal'
import styled from 'styled-components'
import Loader from '../../Loader'
import { useStats } from '../../../../hooks/useStats'
import { CountStat } from './CountStat'
import { Sunburst } from '@ant-design/plots'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

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

interface StatsModalProps {
  onClose: () => void
}

export function StatsModal({ onClose }: StatsModalProps) {
  const stats = useStats()

  return (
    <Modal onClose={onClose} title='Tableau de bord statistiques' style={{ width: 600 }}>
      <StyledWrapper>
        {stats ? (
          <>
            <section>
              <div className='wrapper'>
                <CountStat label='Total' count={stats.total} />
                <CountStat label='En attente' count={stats.totalPending} />
                <CountStat label='Traités' count={stats.totalProcessed} />
                <CountStat label='Ignorés' count={stats.totalIgnored} />
                <CountStat label='Expirés' count={stats.totalExpired} />
              </div>
            </section>

            <section>
              <Sunburst
                data={stats.sourceChartData}
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
                data={stats.clientChartData}
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
        ) : (
          <Loader />
        )}
      </StyledWrapper>
    </Modal>
  )
}

import styled from 'styled-components'
import React, { useContext, useState } from 'react'
import { Header } from '../composants/common/Header'
import { AboutModal } from '../composants/about/AboutModal'
import SourceContext from '../contexts/source.context'

const Layout = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100dvh;

  > header {
    flex: 0 0 auto;
  }

  > main {
    display: flex;
    flex: 1 1 auto;
  }
`

interface BaseLayoutProps {
  children?: React.ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const [showInfo, setShowInfo] = useState(false)
  const { source } = useContext(SourceContext)

  return (
    <Layout>
      <Header customSource={source} toggleShowInfo={() => setShowInfo((state) => !state)} />
      <main>{children}</main>
      {showInfo && <AboutModal onClose={() => setShowInfo(false)} />}
    </Layout>
  )
}

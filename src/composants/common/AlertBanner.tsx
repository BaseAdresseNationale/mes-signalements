import React from 'react'
import Notice from '@codegouvfr/react-dsfr/Notice'

const ALERT_MESSAGE = process.env.REACT_APP_ALERT_MESSAGE?.trim()

export function AlertBanner() {
  if (!ALERT_MESSAGE) {
    return null
  }

  return <Notice title={ALERT_MESSAGE} severity='warning' style={{ flex: '0 0 auto' }} />
}

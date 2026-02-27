import React, { useContext, useEffect, useMemo } from 'react'
import AlertForm from '../composants/alert/AlertForm'
import { AlertContext } from '../contexts/alert.context'
import { useMapContent } from '../hooks/useMapContent'
import AlertMap from '../composants/map/alert/AlertMap'
import Alert from '@codegouvfr/react-dsfr/Alert'

export function AlertPage() {
  const { onEditAlert, alert, deleteAlert } = useContext(AlertContext)

  useEffect(() => {
    const createAlertButton = document.getElementById('create-alert-button')
    if (createAlertButton) {
      createAlertButton.classList.add('active')
    }

    return () => {
      deleteAlert()
      if (createAlertButton) {
        createAlertButton.classList.remove('active')
      }
    }
  }, [])

  const mapContent = useMemo(() => {
    return <AlertMap alert={alert} onEditAlert={onEditAlert} />
  }, [alert, onEditAlert])

  useMapContent(mapContent)

  return alert?.point ? (
    <AlertForm alert={alert} onEdit={onEditAlert} />
  ) : (
    <Alert
      severity='info'
      title=''
      description='Cliquez sur la carte là où vous souhaitez déposer votre alerte'
    />
  )
}

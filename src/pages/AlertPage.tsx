import React, { useContext, useEffect } from 'react'
import AlertForm from '../composants/alert/AlertForm'
import { AlertContext } from '../contexts/alert.context'

export function AlertPage() {
  const { onEditAlert, alert } = useContext(AlertContext)

  useEffect(() => {
    const createAlertButton = document.getElementById('create-alert-button')
    if (createAlertButton) {
      createAlertButton.classList.add('active')
    }

    return () => {
      if (createAlertButton) {
        createAlertButton.classList.remove('active')
      }
    }
  }, [])

  return alert ? <AlertForm alert={alert} onEdit={onEditAlert} /> : null
}

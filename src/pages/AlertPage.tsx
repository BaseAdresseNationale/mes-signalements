import React, { useContext, useEffect, useMemo } from 'react'
import AlertForm from '../composants/alert/AlertForm'
import { AlertContext } from '../contexts/alert.context'
import { useMapContent } from '../hooks/useMapContent'
import AlertMap from '../composants/map/alert/AlertMap'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Loader from '../composants/common/Loader'
import SignalementDisabled from '../composants/signalement/SignalementDisabled'
import { CreateAlertDTO } from '../api/signalement'

export function AlertPage() {
  const { onEditAlert, alert, deleteAlert, communeStatus, isCommuneStatusLoading, codeCommune } =
    useContext(AlertContext)

  console.log('AlertPage render', { alert, communeStatus, isCommuneStatusLoading, codeCommune })

  const hasAlertPosition = !!alert?.point

  // Activate placement mode on map when arriving on the page, and clean up on unmount
  useEffect(() => {
    let observer: MutationObserver | null = null

    const activateButton = (btn: HTMLElement) => {
      btn.classList.add('active')
      btn.setAttribute('disabled', 'true')
    }

    const existingButton = document.getElementById('create-alert-button')
    if (existingButton) {
      activateButton(existingButton)
    } else {
      // The map control may not be in the DOM yet — watch for it
      observer = new MutationObserver(() => {
        const btn = document.getElementById('create-alert-button')
        if (btn) {
          if (!hasAlertPosition) {
            btn.dispatchEvent(new CustomEvent('enter-placement-mode'))
          }
          activateButton(btn)
          observer?.disconnect()
          observer = null
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      deleteAlert()
      observer?.disconnect()
      const btn = document.getElementById('create-alert-button')
      if (btn) {
        btn.classList.remove('active')
        btn.removeAttribute('disabled')
      }
    }
  }, [hasAlertPosition])

  const mapContent = useMemo(() => {
    return <AlertMap alert={alert as Pick<CreateAlertDTO, 'point'>} onEditAlert={onEditAlert} />
  }, [alert, onEditAlert])

  useMapContent(mapContent)

  if (hasAlertPosition) {
    return isCommuneStatusLoading ? (
      <Loader />
    ) : communeStatus.disabled ? (
      <SignalementDisabled codeCommune={codeCommune} />
    ) : (
      <AlertForm alert={alert as CreateAlertDTO} onEdit={onEditAlert} />
    )
  } else {
    return (
      <Alert
        severity='info'
        title='Où souhaitez-vous déposer votre alerte ?'
        description='Cliquez sur la carte là où vous souhaitez déposer votre alerte'
      />
    )
  }
}

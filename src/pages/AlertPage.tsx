import React, { useMemo } from 'react'
import AlertForm from '../composants/alert/AlertForm'
import { useMapContent } from '../hooks/useMapContent'
import AlertMap from '../composants/map/alert/AlertMap'
import Loader from '../composants/common/Loader'
import SignalementDisabled from '../composants/signalement/SignalementDisabled'
import { CreateAlertDTO } from '../api/signalement'
import { useLoaderData } from 'react-router-dom'
import { useAlert } from '../hooks/useAlert'

export function AlertPage() {
  const { initialAlert } = useLoaderData() as {
    initialAlert: Partial<CreateAlertDTO>
  }

  const { alert, onEditAlert, communeStatus, isCommuneStatusLoading, codeCommune } = useAlert({
    initialAlert,
  })

  const mapContent = useMemo(() => {
    return <AlertMap alert={alert as Pick<CreateAlertDTO, 'point'>} onEditAlert={onEditAlert} />
  }, [alert, onEditAlert])

  useMapContent(mapContent)

  return isCommuneStatusLoading ? (
    <Loader />
  ) : communeStatus.disabled ? (
    <SignalementDisabled codeCommune={codeCommune} />
  ) : (
    <AlertForm codeCommune={codeCommune} alert={alert as CreateAlertDTO} onEdit={onEditAlert} />
  )
}

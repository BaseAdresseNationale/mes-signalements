import React from 'react'
import { Alert } from '../../api/signalement'
import AlertInfos from './alert-viewer/AlertInfos'

interface AlertViewerProps {
  alert: Alert
}

export default function AlertViewer({ alert }: AlertViewerProps) {
  return (
    <>
      <AlertInfos alert={alert} />
    </>
  )
}

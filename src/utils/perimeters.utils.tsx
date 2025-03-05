import { APIDepotRevision } from '../api/api-depot/types'
import { SignalementMode } from '../types/signalement.types'

const ObjectIdRE = new RegExp('^[0-9a-fA-F]{24}$')

export const getSignalementMode = (currentRevision: APIDepotRevision | null) => {
  if (!currentRevision) {
    return SignalementMode.DISABLED
  }

  // TODO: If the current revision has a BAL ID and it's a valid ObjectId, we can deduce that it's from Mes-adresses
  if (
    currentRevision.context.extras?.balId &&
    ObjectIdRE.test(currentRevision.context.extras.balId)
  ) {
    return SignalementMode.FULL
  }

  return SignalementMode.LIGHT
}

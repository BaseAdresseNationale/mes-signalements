import {
  DeleteNumeroChangesRequestedDTO,
  NumeroChangesRequestedDTO,
  ToponymeChangesRequestedDTO,
  VoieChangesRequestedDTO,
} from '../api/signalement'

export type ChangesRequested = NumeroChangesRequestedDTO &
  DeleteNumeroChangesRequestedDTO &
  VoieChangesRequestedDTO &
  ToponymeChangesRequestedDTO

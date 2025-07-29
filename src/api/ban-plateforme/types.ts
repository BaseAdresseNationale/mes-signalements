import { Position } from '../signalement'

export enum BANPlateformeResultTypeEnum {
  NUMERO = 'numero',
  VOIE = 'voie',
  LIEU_DIT = 'lieu-dit',
  COMMUNE = 'commune',
}

export interface IBANPlateformeResult {
  id: string
  type: BANPlateformeResultTypeEnum
  banId?: string
  displayBBox?: [number, number, number, number]
}

export interface IBANPlateformeCommune extends IBANPlateformeResult {
  type: BANPlateformeResultTypeEnum.COMMUNE
  codeCommune: string
  codesPostaux: string[]
  departement: {
    nom: string
    code: string
  }
  displayBBox: [number, number, number, number]
  nbLieuxDits: number
  nbVoies: number
  nbNumeros: number
  nbNumerosCertifies: number
  nomCommune: string
  population: number
  region: {
    nom: string
    code: string
  }
  voies: (IBANPlateformeVoie | IBANPlateformeLieuDit)[]
}

export interface IBANPlateformeNumero extends IBANPlateformeResult {
  type: BANPlateformeResultTypeEnum.NUMERO
  numero: number
  suffixe: string
  positions: {
    positionType: Position.type
    position: {
      type: string
      coordinates: [number, number]
    }
  }[]
  parcelles: string[]
  voie: {
    id: string
    nomVoie: string
  }

  lieuDitComplementNom: string
  certifie: boolean
  lat: number
  lon: number
  positionType: Position.type
  commune: {
    code: string
    id: string
    nom: string
    departement: {
      nom: string
      code: string
    }
    region: {
      nom: string
      code: string
    }
    voies: (IBANPlateformeVoie | IBANPlateformeLieuDit)[]
  }
  codePostal: string
}

export interface IBANPlateformeVoie extends IBANPlateformeResult {
  type: BANPlateformeResultTypeEnum.VOIE
  nomVoie: string
  displayBBox: [number, number, number, number]
  numeros: IBANPlateformeNumero[]
  commune: {
    code: string
    id: string
    nom: string
    departement: {
      nom: string
      code: string
    }
    region: {
      nom: string
      code: string
    }
    voies: (IBANPlateformeVoie | IBANPlateformeLieuDit)[]
  }
  codePostal: string
}

export interface IBANPlateformeLieuDit extends IBANPlateformeResult {
  type: BANPlateformeResultTypeEnum.LIEU_DIT
  position: {
    type: Position.type
    coordinates: [number, number]
  }
  nomVoie: string
  parcelles: string[]
  displayBBox: [number, number, number, number]
  numeros: IBANPlateformeNumero[]
  commune: {
    code: string
    id: string
    nom: string
    departement: {
      nom: string
      code: string
    }
    region: {
      nom: string
      code: string
    }
    voies: (IBANPlateformeVoie | IBANPlateformeLieuDit)[]
  }
  codePostal: string
}

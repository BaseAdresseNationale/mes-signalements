import { Position } from '../signalement'

export enum BANPlateformeResultTypeEnum {
  NUMERO = 'numero',
  VOIE = 'voie',
  LIEU_DIT = 'lieu-dit',
}

export interface IBANPlateformeResult {
  id: string
  type: BANPlateformeResultTypeEnum
  banId?: string
  commune: IBANPlateformeCommune
  codePostal: string
}

export interface IBANPlateformeCommune {
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
}

export interface IBANPlateformeVoie extends IBANPlateformeResult {
  type: BANPlateformeResultTypeEnum.VOIE
  nomVoie: string
  displayBBox: [number, number, number, number]
  numeros: IBANPlateformeNumero[]
}

export interface IBANPlateformeLieuDit extends IBANPlateformeResult {
  type: BANPlateformeResultTypeEnum.LIEU_DIT
  positions: {
    positionType: Position.type
    position: {
      type: string
      coordinates: [number, number]
    }
  }[]
  nomVoie: string
  parcelles: string[]
  displayBBox: [number, number, number, number]
  numeros: IBANPlateformeNumero[]
}

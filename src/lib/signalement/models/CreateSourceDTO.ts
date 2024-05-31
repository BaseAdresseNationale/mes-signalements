/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSourceDTO = {
    nom: string;
    type: CreateSourceDTO.type;
};
export namespace CreateSourceDTO {
    export enum type {
        ADMINISTRATION = 'ADMINISTRATION',
        PARTICULIER = 'PARTICULIER',
        ENTREPRISE = 'ENTREPRISE',
    }
}


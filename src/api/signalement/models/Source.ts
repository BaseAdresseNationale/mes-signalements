/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Alert } from './Alert';
import type { Signalement } from './Signalement';
export type Source = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    nom: string;
    type: Source.type;
    signalements?: Array<Signalement> | null;
    alerts?: Array<Alert> | null;
};
export namespace Source {
    export enum type {
        PUBLIC = 'PUBLIC',
        PRIVATE = 'PRIVATE',
    }
}


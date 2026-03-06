/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Alert } from './Alert';
import type { Signalement } from './Signalement';
export type Client = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    nom: string;
    processedSignalements?: Array<Signalement> | null;
    processedAlerts?: Array<Alert> | null;
};


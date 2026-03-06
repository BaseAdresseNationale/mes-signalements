/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Author } from './Author';
import type { Client } from './Client';
import type { Source } from './Source';
export type Alert = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    codeCommune: string;
    nomCommune?: string | null;
    type: Alert.type;
    point: Record<string, any>;
    author?: Author | null;
    status: Alert.status;
    source: Source;
    processedBy?: Client | null;
};
export namespace Alert {
    export enum type {
        MISSING_ADDRESS = 'MISSING_ADDRESS',
        ROAD_PROBLEM = 'ROAD_PROBLEM',
        OTHER = 'OTHER',
    }
    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }
}


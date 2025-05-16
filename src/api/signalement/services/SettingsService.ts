/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * Return true if the given codeCommune is disabled
     * @param codeCommune
     * @returns boolean
     * @throws ApiError
     */
    public static isCommuneDisabled(
        codeCommune: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/settings/communes-disabled/{codeCommune}',
            path: {
                'codeCommune': codeCommune,
            },
        });
    }
    /**
     * Update the disabled of communes with the given codeCommune
     * @param codeCommune
     * @returns any
     * @throws ApiError
     */
    public static updateCommunesDisabled(
        codeCommune: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/settings/communes-disabled/{codeCommune}',
            path: {
                'codeCommune': codeCommune,
            },
        });
    }
}

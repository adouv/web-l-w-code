export const OAUTH_URL = '/oauth/token';
export const CACHE_TOKEN = 'token';
export const DEFAULT_OAUTH2_MODE = {client_id: '1', client_secret: '123', scope: 'read', grant_type: 'password'};

export interface Oauth2Result {
    access_token: string;

    refresh_token: string;

    expires_in: number;
}

export interface Oauth2Model {
    client_id: string;

    client_secret: string;

    scope: string;

    grant_type: string;

    username?: string;

    password?: string;
}


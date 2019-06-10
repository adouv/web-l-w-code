import { Injectable } from '@angular/core';
import { LwStorageService } from '../cache';
import { CACHE_TOKEN, Oauth2Result } from './oauth2.model';

@Injectable()
export class LwOauth2TokenService {
  constructor(private storageService: LwStorageService) {
  }

  cacheToken(token: Oauth2Result) {
    this.storageService.set(CACHE_TOKEN, token);
  }

  getAccessToken() {
    const oauthToken = this.storageService.get(CACHE_TOKEN);
    return oauthToken ? oauthToken.access_token : null;
  }

  getRefreshToken(): string | null {
    const oauthToken = this.storageService.get(CACHE_TOKEN);
    return oauthToken ? oauthToken.refresh_token : null;
  }

  removeToken() {
    return this.storageService.remove(CACHE_TOKEN);
  }

}


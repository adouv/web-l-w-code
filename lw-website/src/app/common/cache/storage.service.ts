import { Injectable } from '@angular/core';
import { CACHE_TOKEN } from '../oauth2/oauth2.model';
import { Base64Service } from './base64.service';
import { isObject } from 'rxjs/internal-compatibility';

@Injectable()
export class LwStorageService {

  constructor(private base64Service: Base64Service) {
  }

  get(key: string): any {
    if (this.isEmpty(key)) {
      const value = localStorage.getItem(key);
      if (key === CACHE_TOKEN && !value) {
        return this.getUrlToken().token;
      } else {
        return isObject(value) ? value : JSON.parse(value);
      }
    } else {
      return null;
    }
  }

  set(key: string, value: any) {
    if (this.isEmpty(key) && this.isEmpty(value)) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  remove(key: string) {
    if (this.isEmpty(key)) {
      window.localStorage.removeItem(key);
    }
  }

  clear() {
    window.localStorage.clear();
  }


  getUrlToken() {
    const url = decodeURIComponent(location.href);
    const codeIndex = url.indexOf('?');
    if (codeIndex > -1 && url.includes('loginfo')) {
      const loginfo = url.slice(codeIndex + 9);
      const forValue = JSON.parse(this.base64Service.decode(loginfo || ''));
      if (forValue) {
        for (const val in forValue) {
          localStorage.setItem(val, JSON.stringify(forValue[val]));
        }
      }
      return forValue;
    }
    return {};
  }

  private isEmpty(val: any): boolean {
    return val !== undefined && val !== '' && val !== null;
  }
}

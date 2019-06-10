import { Injectable } from '@angular/core';
import { formatDuring } from '../utils';

@Injectable()
export class LwLoggerService {

  times: { url: string, time: number }[] = [];

  constructor() {
  }

  requestTime(request) {
    if (request.url) {
      const currentTime = new Date().getTime();
      this.times.push({url: request.url, time: currentTime});
    }
  }

  responseTime(response) {
    if (response.url) {
      const currentTime = new Date().getTime();
      const index = this.times.findIndex(time => response.url.endsWith(time.url));
      // console.log('响应时长：' + response.url + ' ==> ' + formatDuring(currentTime - this.times[index].time));
      this.times.splice(index, 1);
    }
  }
}

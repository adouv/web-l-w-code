import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
/**
 * 工具类
 * @export
 * @class UtilsService
 */
@Injectable()
export class SussService {
  subject_id: number;
  private subject: Subject<any>;
  private messageSubject: Subject<any>;
  constructor() {
    this.subject = new Subject<any>();
    this.messageSubject = new Subject<any>();
  }
  /**
   * 发布信息
   * @param object 信息
   */
  releaseMessage(key: string, val: any): void {
    this.messageSubject.next({ key: key, val: val });
  }
  /**
   * 订阅信息
   * @param object 信息
   */
  subscriptionMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
  /**
   * 清除信息
   */
  clearMessage(): void {
    this.messageSubject.next();
  }
}
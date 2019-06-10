import {OnInit, OnDestroy} from '@angular/core';
import {isFunction} from 'rxjs/util/isFunction';
import {formatDuring, LwConsole} from '../utils';

export interface PageLogger {
    remember?: boolean;
}

const initialLogger = {};

export function PageLogger(logger: PageLogger = initialLogger) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        return class extends constructor implements OnInit, OnDestroy {
            viewInitTime: Date;

            location: string = location.toString();

            entryTime: Date = new Date();

            ngOnInit(): void {
                this.viewInitTime = new Date();
                const time = this.viewInitTime.getTime() - this.entryTime.getTime();
                LwConsole.out('视图渲染时长：' + this.location + ' ==> ' + formatDuring(time));
                if (isFunction(super.ngOnInit)) {
                    super.ngOnInit();
                }
            }

            ngOnDestroy(): void {
                if (isFunction(super.ngOnDestroy)) {
                    super.ngOnDestroy();
                }
                const time = new Date().getTime() - this.viewInitTime.getTime();
                LwConsole.out('页面停留时长：' + this.location + ' ==> ' + formatDuring(time));
            }
        };
    };
}


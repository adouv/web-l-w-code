import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'ToPercentage'
})
export class ToPercentagePipe implements PipeTransform {
    transform(value: any, len: number): any {
        if (value) {
            return value ? Math.floor(value * 100) : 0;
        }
    }
}
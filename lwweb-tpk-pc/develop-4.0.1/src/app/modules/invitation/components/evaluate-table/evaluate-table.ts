import {Component, ViewChild, ElementRef, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'evaluate-table',
    templateUrl: './evaluate-table.html',
    styleUrls: ['./evaluate-table.scss']
})

export class EvaluateTableComponent {

    @Input() isUsed: boolean;
    @Input() isSubmit: boolean;
    @Input() tempData: any;

    @Output()
    tempDataChange = new EventEmitter<any>();
    @Output()
    isSubmitChange = new EventEmitter<any>();

    constructor() {

    }

    // 计算总分数
    computeScore(index, datas) {
        const list = this.tempData.items[index];
        list.score = 0;
        this.tempData.totalScore = 0;
        list.childItems.map(data => {
            if (data.score) {
                data.score = (data.score + '').replace(/^[^1-9]/, '').replace(/[^0-9]/g, '').substr(0, 2);
                list.score += parseInt(data.score ? data.score : 0, 0);
            }
        });
        this.tempData.items.map(item => {
            this.tempData.totalScore += parseInt(item.score, 0);
        });
    }

    changeName($event, item) {
        if ($event !== item.name) {
            item.name = event;
            item.itemModify = true;
        }
    }

    changeScore(item, event) {
        if (event !== item.score) {
            item.score = event;
            item.itemModify = true;
        }
    }

    emptyValue() {
        this.isSubmit = false;
        this.isSubmitChange.emit(false);
    }
}

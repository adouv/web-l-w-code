import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'unfinished-evaluation',
	template: `
		<ul *ngIf="persons.length>0">
			<li [ngClass]="{'liCanClick':canClick}" *ngFor="let person of persons" (click)="onClick(person)">
				<a href="javascript:void(0);"
				   [ngClass]="{'active':activeAccountId===person.accountId}">{{person.displayName}}</a>
			</li>
		</ul>
		<div class="no-result" *ngIf="!persons || persons.length < 1">相关老师已完成教学评价</div>
	`,
	styleUrls: [`unfinished-evaluation.component.scss`]
})

export class UnfinishedEvaluationComponent implements OnInit {

	@Input() persons = [];

	@Input() activeAccountId: string;

	@Output() change = new EventEmitter();
	@Input() canClick: any;
	constructor() {
		this.canClick = false;
	}

	ngOnInit() {
	}

	onClick(data) {
		this.change.emit(data.accountId);
	}
}
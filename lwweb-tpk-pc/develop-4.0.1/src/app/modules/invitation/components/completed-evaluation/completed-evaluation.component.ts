import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AccountService} from '../../../../services/account';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'completed-evaluation',
	templateUrl: 'completed-evaluation.component.html',
	styleUrls: ['completed-evaluation.component.scss']
})

export class CompletedEvaluationComponent implements OnChanges {

	@Input() persons = [];

	@Input() id: string;

	@Input() data: any;

	@Input() type: number;

	tabType = 0;

	accountId;

	currentResult = {};

	showStatistics: boolean;

	constructor(private accountService: AccountService,
				router: ActivatedRoute) {
		router.params.subscribe(data => {
			this.showStatistics = data.type === '0' && data.appraise === '1';
		});
	}

	ngOnChanges() {
		if (this.persons && this.persons.length > 0) {
			this.accountId = this.persons[0].accountId;
		}
	}

	onChange(accountId) {
		this.accountId = accountId;
		this.tabType = 0;
	}
}

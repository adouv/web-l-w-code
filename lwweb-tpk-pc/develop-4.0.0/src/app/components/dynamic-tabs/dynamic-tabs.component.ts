import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
	selector: 'dynamic-tabs',
	styleUrls: ['./dynamic-tabs.component.scss'],
	template: `
		<nz-tabset [nzShowPagination]="false" *ngIf="tabInputs&&tabsComponents" class="video-detail-tabs"
				   [nzSize]="'small'" [(nzSelectedIndex)]="selectedIndex" (nzSelectChange)="selectedChange()">
			<nz-tab *ngFor="let tab of tabsComponents;let i = index" [nzDisabled]="tab.disabled">
				<ng-template #nzTabHeading>
					{{tab?.label}}
				</ng-template>
				<ndc-dynamic [ndcDynamicComponent]="tab?.component"
							 [ndcDynamicInputs]="tabInputs[i]"
							 [ndcDynamicOutputs]="tabOutputs[i]"
				></ndc-dynamic>
			</nz-tab>
		</nz-tabset>
	`
})

export class DynamicTabsComponent implements OnChanges {

	@Input() tabsComponents: { label: string; component: Component; disabled: boolean }[] = [];

	@Input() tabInputs: any[] = [];

	@Input() tabOutputs: any[] = [];

	@Input() selectedIndex = 0;

	@Output() selectedIndexChange = new EventEmitter<any>();

	constructor() {
	}

	ngOnChanges() {
	}

	selectedChange() {
		this.selectedIndexChange.emit(this.selectedIndex);
	}
}

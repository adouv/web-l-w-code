import {Component, Input} from '@angular/core';

@Component({
	selector: 'invitation-detail-tab',
	templateUrl: 'invitation-detail-tab.component.html',
	styleUrls: ['invitation-detail-tab.component.scss']
})

export class InvitationDetailTabComponent {

	@Input() data: any;
	@Input() videoInfo = {};

	constructor() {
	}

}

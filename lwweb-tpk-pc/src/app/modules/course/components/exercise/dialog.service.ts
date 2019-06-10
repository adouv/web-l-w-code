import {ConfirmationService} from 'primeng/primeng';
import {Injectable} from '@angular/core';

@Injectable()
export class CourseDialogService {

	public openConfirmDialog(confirmationService: ConfirmationService,
							title: string, msg: string,
							acceptCallBack?: Function,
							rejectCallBack?: Function,
							dialogKey?: string) {
		confirmationService.confirm({
			message: msg,
			key: dialogKey ? dialogKey : 'confirmDialogKey',
			header: title,
			icon: 'fa fa-question-circle',
			accept: () => {
				if (acceptCallBack) {
					acceptCallBack();
				}
			},
			reject: () => {
				if (rejectCallBack) {
					rejectCallBack();
				}
			}
		});
	}
}

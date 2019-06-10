import {NgModule} from '@angular/core';
import {FlowDefaultUploader, FlowSelectFile} from './flow-select-file.directive';
import {FlowUploader} from './flow-uploader.model';

@NgModule({
	imports: [],
	exports: [FlowSelectFile],
	declarations: [FlowSelectFile],
	providers: [],
})
export class FlowModule {
}

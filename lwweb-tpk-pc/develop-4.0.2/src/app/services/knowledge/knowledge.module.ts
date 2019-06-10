import {NgModule} from '@angular/core';
import {KnowledgeInterface} from './knowledge.interface';
import {KnowledgeService} from './knowledge.service';


@NgModule({
	imports: [],
	exports: [],
	providers: [
		KnowledgeInterface,
		KnowledgeService
	],
})
export class KnowledgeServiceModule {
}

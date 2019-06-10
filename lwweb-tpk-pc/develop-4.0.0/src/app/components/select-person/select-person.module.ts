import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {StoreModule} from '@ngrx/store';
import {SelectPersonComponent} from './containers/select-person.component';
import {SelectedPersonComponent} from './components/selected-person/selected-person.component';
import {GardenDistrictComponent} from './components/garden-district/garden-district.component';
import {OrganizationComponent} from './components/organization/organization.component';
import {TreeElementComponent} from './components/tree-element/tree-element.component';
import {TreeComponent} from './components/tree/tree.component';
import {SelectPersonService} from './services/select-person.service';
import {reducers} from './reducers';
import {SelectPersonInterface} from './services/select-person.interface';
import {LwHttpModule} from '../../common';
import {ComponentsModule} from '../components.module';

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		NgZorroAntdModule,
		LwHttpModule,
		ComponentsModule,
		StoreModule.forRoot(reducers)
	],
	exports: [
		StoreModule
	],
	declarations: [
		SelectPersonComponent,
		SelectedPersonComponent,
		GardenDistrictComponent,
		OrganizationComponent,
		TreeComponent,
		TreeElementComponent
	],
	entryComponents: [
		SelectPersonComponent,
		SelectedPersonComponent,
		GardenDistrictComponent,
		OrganizationComponent,
		TreeComponent,
		TreeElementComponent
	],
	providers: [SelectPersonInterface, SelectPersonService]
})

export class SelectPersonModule {
}
import { ManageComponent } from './manage.component';
import { EditComponent } from './edit/edit.component';

export const manageRoutes = [
    {
        path: '',
        component: ManageComponent,
        pathMatch: 'full'
    },
    {
        path: 'edit',
        component: EditComponent,
        pathMatch: 'full'
    },
];
import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../reducers';
import * as selectParsonAction from '../../actions/select-person.actions';
@Component({
    selector: 'lw-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
    data: Observable<any>;
    constructor(private store: Store<fromRoot.State>) {
        this.data = this.store.select(fromRoot.getTreeData);
    }
    ngOnInit() {
    }
}

import {ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector} from '@ngrx/store';
import * as selectPerson from './select-person.reducers';
import { environment } from '../../../../environments/environment';
export interface State {
    selectPerson: selectPerson.State,
}
export const reducers: ActionReducerMap<State> = {
    selectPerson: selectPerson.reducer
}

export const getSelectPersonState = (state: State) => state.selectPerson;
export const getSelectPersonData = createSelector(getSelectPersonState, selectPerson.getSelectPersonData);
export const getSearchData = createSelector(getSelectPersonState, selectPerson.getSearchData);
export const getAddressPositionData = createSelector(getSelectPersonState, selectPerson.getAddressPositionData);
export const getSelectGardenData = createSelector(getSelectPersonState, selectPerson.getSelectGardenData);
export const getTreeData = createSelector(getSelectPersonState, selectPerson.getTreeData);
export const getGardenLength = createSelector(getSelectPersonState, selectPerson.getGardenLength);
export const getDisablePersons = createSelector(getSelectPersonState, selectPerson.getDisablePersons);
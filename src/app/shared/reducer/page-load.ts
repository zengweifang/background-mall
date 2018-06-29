import { ActionReducer, Action } from "@ngrx/store";

export const LOADINGOPEN = 'LOADINGOPEN';
export const LOADINGCLOSE = 'LOADINGCLOSE';

export function pageLoading(state: boolean = false, action: Action) {
    switch (action.type) {
        case LOADINGOPEN:
            return true;
        case LOADINGCLOSE:
            return false;
        default:
            return state;
    }
}
import { fromJS } from 'immutable';
import * as actionTypes from './constants';

const defaultState = fromJS({
    singerList: [],
    enterLoading: true,
    pollUpLoading: false,
    pollDownLoading: false,
    pageCount: 0
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER_LIST:
            return state.set('singerList', action.data);
        case actionTypes.CHANGE_PULLUP_LOADING:
            return state.set('pollUpLoading', action.data);
        case actionTypes.CHANGE_PULLDOWN_LOADING:
            return state.set('pollDownLoading', action.data);
        case actionTypes.CHANGE_PAGE_OUNT:
            return state.set('pageCount', action.data);
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('enterLoading', action.data);
        default:
            return state;
    }
}
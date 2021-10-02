import {
    getHotSingerListRequest,
    getSingerListRequest
} from '../../../api/request';

import {
    CHANGE_PAGE_OUNT,
    CHANGE_ENTER_LOADING,
    CHANGE_PULLDOWN_LOADING,
    CHANGE_PULLUP_LOADING,
    CHANGE_SINGER_LIST
} from './constants';

import { fromJS } from 'immutable';

export const changeSingerList = (data) => ({
    type: CHANGE_SINGER_LIST,
    data: fromJS(data)
});

export const changePageCount = (data) => ({
    type: CHANGE_PAGE_OUNT,
    data
});

export const changePullUpLoading = (data) => ({
    type: CHANGE_PULLUP_LOADING,
    data
});

export const changePullDownLoading = (data) => ({
    type: CHANGE_PULLDOWN_LOADING,
    data
});

export const changeEntryLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

export const getHotSingerList = () => {
    return (dispatch) => {
        getHotSingerListRequest(0).then(res => {
            const data = res.artists;
            dispatch(changeSingerList(data));
            dispatch(changeEntryLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch(e => {
            console.log('热门歌手数据获取失败');
        });
    }
}

export const refreshMoreHotSingerList = () => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getHotSingerListRequest(pageCount)
            .then(res => {
                const data = [...singerList, ...res.artists];
                dispatch(changeSingerList(data));
                dispatch(changePullUpLoading(false));
            }).catch(e => {
                console.log('热门歌手数据获取失败');
            });
    }
}

export const getSingerList = (category, alpha) => {
    return (dispatch) => {
        getSingerListRequest(category, alpha, 0)
            .then(res => {
                const data = res.artists;
                dispatch(changeSingerList(data));
                dispatch(changeEntryLoading(false));
                dispatch(changePullDownLoading(false));
            })
            .catch(() => {
                console.log('歌手数据获取失败');
            });
    }
}

export const refreshMoreSingerList = (category, alpha) => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getSingerListRequest(category, alpha, pageCount)
            .then(res => {
                const data = [...singerList, ...res.artists];
                dispatch(changeSingerList(data));
                dispatch(changePullUpLoading(false));
            })
            .catch(() => {
                console.log('歌手数据获取失败');
            });
    }
}
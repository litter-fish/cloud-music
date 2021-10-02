import {
    CHANGE_CURRENT_ALBUM,
    CHANGE_ENTER_LOAGING
} from './constants';

import { fromJS } from 'immutable';

import {
    getAlbumDetailRequest
} from '../../../api/request';

const changeCurrentAlbum = (data) => ({
    type: CHANGE_CURRENT_ALBUM,
    data: fromJS(data)
});

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOAGING,
    data
});

export const getAlbumList = (id) => {
    return dispatch => {
        getAlbumDetailRequest(id).then(res => {
            let data = res.playlist;
            dispatch(changeCurrentAlbum(data));
            dispatch(changeEnterLoading(false));
        }).catch(() => {
            console.log("获取 album 数据失败！")
        })
    }
}
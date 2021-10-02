import { fromJS } from 'immutable';
import { getRankListRequest } from '../../../api/request';
import {
    CHANGE_LOADING,
    CHANGE_RANK_LIST
} from './constants';


const changeLoading = (data) => ({
    type: CHANGE_LOADING,
    data
});

const changeRankList = (data) => ({
    type: CHANGE_RANK_LIST,
    data: fromJS(data)
});

export const getRankList = () => {
    return (dispatch) => {
        getRankListRequest().then(data => {
            let list = data && data.list;
            dispatch(changeRankList(list));
            dispatch(changeLoading(false));
        }).catch(e => {
            console.log('Rank数据获取失败');
        });
    }
}


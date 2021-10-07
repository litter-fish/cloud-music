import {
    CHANGE_ARTIST,
    CHANGE_SONGS_OF_ARTIST,
    CHANGE_ENTER_LOADING
} from './constants';
import { fromJS } from 'immutable';
import { getSingerInfoRequest } from '../../../api/request';

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

const changeArtist = (data) => ({
    type: CHANGE_ARTIST,
    data: fromJS(data)
});

const changeSongsOfArtist = (data) => ({
    type: CHANGE_SONGS_OF_ARTIST,
    data: fromJS(data)
});

export const getSingerInfo = (id) => {
    return dispatch => {
        getSingerInfoRequest(id)
            .then(res => {
                dispatch(changeArtist(res.artist));
                dispatch(changeSongsOfArtist(res.hotSongs));
                dispatch(changeEnterLoading(false));
            })
            .catch(() => {

            })
    }
}
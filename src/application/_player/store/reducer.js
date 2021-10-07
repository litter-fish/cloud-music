import { playMode } from '../../../api/config';
import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { findIndex } from '../../../api/utils';

const defaultState = fromJS({
    fullScreen: false, // 播放器是否为全屏模式
    playing: false, // 当前歌曲是否播放
    sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
    playList: [],
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前歌曲在播放列表的索引位置
    showPlayList: false, // 是否展示播放列表
    currentSong: {}
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_SONG:
            return state.set('currentSong', action.data);
        case actionTypes.SET_FULL_SCREEN:
            return state.set('fullScreen', action.data);
        case actionTypes.SET_PLAYING_STATE:
            return state.set('playing', action.data);
        case actionTypes.SET_SEQUENCE_PLAYLIST:
            return state.set('sequencePlayList', action.data);
        case actionTypes.SET_PLAYLIST:
            return state.set('playList', action.data);
        case actionTypes.SET_PLAY_MODE:
            return state.set('mode', action.data);
        case actionTypes.SET_CURRENT_INDEX:
            return state.set('currentIndex', action.data);
        case actionTypes.SET_SHOW_PLAYLIST:
            return state.set('showPlayList', action.data);
        case actionTypes.INSERT_SONG:
            return handleInsertSong(state, action.data);
        default:
            return state;
    }
}

const handleInsertSong = (state, song) => {
    const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
    const sequencePlayList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
    let currentIndex = state.get('currentIndex');
    let fpIndex = findIndex(song, playList);
    // 如果是当前歌曲不需要处理
    if (fpIndex === currentIndex && currentIndex !== -1) return state;

    currentIndex++;
    // 加入当前播放曲目的下一个位置
    playList.splice(currentIndex, 0, song);

    if (!!~fpIndex) { // 列表中已经存在要添加的歌
        if (currentIndex > fpIndex) {
            playList.splice(fpIndex, 1);
            currentIndex --;
        } else {
            playList.splice(fpIndex + 1, 1);
        }
    }

    // 处理sequencePlayList
    let sequenceIndex = findIndex(playList[currentIndex], sequencePlayList) + 1;
    let fsIndex = findIndex(song, sequencePlayList);
    sequencePlayList.splice(sequenceIndex, 0, song);
    if (!!~fsIndex) {
        if (sequenceIndex > fsIndex) {
            sequencePlayList.splice(fsIndex, 1);
            sequenceIndex--;
        } else {
            sequencePlayList.splice(fsIndex + 1, 1);
        }
    }

    return state.merge({
        'playList': fromJS (playList),
        'sequencePlayList': fromJS (sequencePlayList),
        'currentIndex': fromJS (currentIndex),
    })
}
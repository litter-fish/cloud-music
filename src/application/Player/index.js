import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    changePlayingState,
    changeShowPlayList,
    changeCurrentIndex,
    changeCurrentSong,
    changePlayList,
    changePlayMode,
    changeFullScreen
} from './store/actionCreators';

import MiniPlayer from './mini-player';
import NormalPlayer from './normal-player';

import {
    getSongUrl,
    getLyricRequest
} from '../../api/request';
import {
    isEmptyObject,
    findIndex,
    shuffle
} from '../../api/utils';
import Toast from '../../base-ui/toast';
import { playMode } from '../../api/config';
import Lyric from './../../api/lyric-parser';

function Player(props) {

    const {
        fullScreen,
        playing,
        currentSong,
        currentIndex,
        mode,
        sequencePlayList,
        playList
    } = props;
    const {
        toggleFullScreenDispatch,
        togglePlayingDispatch,
        changeCurrentIndexDispatch,
        changeCurrentDispatch,
        changeModeDispatch,
        changePlayListDispatch
    } = props;
    // 目前播放时间
    const [currentTime, setCurrentTime] = useState(0);
    // 歌曲总时长
    const [duration, setDuration] = useState(0);
    // 歌曲播放进度
    let percent = Number.isNaN(currentTime / duration) ? 0 : currentTime / duration;
    const [modeText, setModeText] = useState('');
    const [songReady, setSongReady] = useState(true);
    const [currentPlayingLyric, setPlayingLyric] = useState('');
    
    const audioRef = useRef();
    const toastRef = useRef();
    const currentLyric = useRef();
    const currentLineNum = useRef();

    //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
    const [preSong, setPreSong] = useState({});

    const clickPlaying = (e, state) => {
        e.stopPropagation();
        togglePlayingDispatch(state);
        if (currentLyric.current) {
            currentLyric.current.togglePlay(currentTime * 1000);
        }
    };

    const updateTime = (e) => {
        setCurrentTime(e.target.currentTime);
    }

    const onProgressChange = curPercent => {
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
        if (!playing) {
            togglePlayingDispatch(true);
        }
        if (currentLyric.current) {
            currentLyric.current.seek(newTime * 1000);
        }
    }

    const handleLoop = () => {
        audioRef.current.currentTime = 0;
        changePlayingState(true);
        audioRef.current.play();
    }

    const handlePrev = () => {
        // 播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex - 1;
        if (index < 0) index = playList.length - 1;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    }

    const handleNext = () => {
        // 播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex + 1;
        if (index == playList.length) index = 0;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    }

    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            changePlayListDispatch(sequencePlayList);
            const index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
            setModeText('顺序循环');
        } else if (newMode === 1) {
            changePlayListDispatch(sequencePlayList);
            setModeText('单曲循环');
        } else if (newMode === 2) {
            let newList = shuffle(sequencePlayList);
            const index = findIndex(currentSong, newList);
            changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
            setModeText('随机播放');
        }
        changeModeDispatch(newMode);
        toastRef.current.show();
    }

    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop();
        } else {
            handleNext();
        }
    };

    useEffect(() => {
        if (
            !playList.length ||
            currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id
        ) return;

        let current = playList[currentIndex];
        changeCurrentDispatch(current);
        setPreSong(current);
        audioRef.current.src = getSongUrl(current.id);
        setTimeout(() => {
            audioRef.current.play().then(() => {
                setSongReady(true);
            });
        });
        // 播放状态
        togglePlayingDispatch(true);
        getLyric(current.id);
        // 从头开始播放
        setCurrentTime(0);
        // 时长
        setDuration((current.dt / 1000) | 0);
    }, [playList, currentIndex]);

    useEffect(() => {
        playing ? audioRef.current.play() : audioRef.current.pause();
    }, [playing]);

    const handleLyric = ({ lineNum, txt }) => {
        if (!currentLyric.current) return;
        currentLineNum.current = lineNum;
        setPlayingLyric(txt);
    };

    const getLyric = id => {
        let lyric = '';
        if (currentLyric.current) {
            currentLyric.current.stop();
        }
        getLyricRequest(id).then(res => {
            lyric = res.lrc.lyric;
            console.log(lyric);
            if (!lyric) {
                currentLyric.current = null;
                return;
            }
            currentLyric.current = new Lyric(lyric, handleLyric);
            currentLyric.current.play();
            currentLineNum.current = 0;
            currentLyric.current.seek(0);
        }).catch(() => {
            songReady.current = true;
            audioRef.current.play();
        })
    }

    return (
        <div>
            {!isEmptyObject(currentSong) ? 
                <MiniPlayer
                    song={currentSong}
                    fullScreen={fullScreen}
                    toggleFullScreen={toggleFullScreenDispatch}
                    playing={playing}
                    clickPlaying={clickPlaying}
                    currentTime={currentTime}
                    percent={percent}
                    duration={duration}
                    ></MiniPlayer>
            : null}
            {!isEmptyObject(currentSong) ?
                <NormalPlayer
                    song={currentSong}
                    fullScreen={fullScreen}
                    toggleFullScreen={toggleFullScreenDispatch}
                    playing={playing}
                    clickPlaying={clickPlaying}
                    currentTime={currentTime}
                    percent={percent}
                    duration={duration}
                    onProgressChange={onProgressChange}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    mode={mode}
                    changeMode={changeMode}
                    currentLyric={currentLyric.current}
                    currentPlayingLyric={currentPlayingLyric}
                    currentLineNum={currentLineNum.current}
                    ></NormalPlayer>
            : null}
            <audio ref={audioRef} onTimeUpdate={updateTime} onEnded={handleEnd}></audio>
            <Toast text={modeText} ref={toastRef}></Toast>
        </div>
    )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = state => ({
    fullScreen: state.getIn(['player', 'fullScreen']),
    playing: state.getIn(['player', 'playing']),
    currentSong: state.getIn(['player', 'currentSong']).toJS(),
    showPlayList: state.getIn(['player', 'showPlayList']),
    mode: state.getIn(['player', 'mode']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    playList: state.getIn(['player', 'playList']).toJS(),
    sequencePlayList: state.getIn(['player', 'sequencePlayList']).toJS()
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = dispatch => {
    return {
        togglePlayingDispatch(data) {
            dispatch(changePlayingState(data));
        },
        toggleFullScreenDispatch(data) {
            dispatch(changeFullScreen(data));
        },
        togglePlayListDispatch(data) {
            dispatch(changeShowPlayList(data));
        },
        changeCurrentIndexDispatch(index) {
            dispatch(changeCurrentIndex(index));
        },
        changeCurrentDispatch(data) {
            dispatch(changeCurrentSong(data));
        },
        changeModeDispatch(data) {
            dispatch(changePlayMode(data));
        },
        changePlayListDispatch(data) {
            dispatch(changePlayList(data));
        }
    };
};

// 将 ui 组件包装成容器组件
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);
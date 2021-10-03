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

import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';

import { getSongUrl } from '../../api/request';
import {
    isEmptyObject,
    findIndex,
    shuffle
} from '../../api/utils';
import Toast from '../../baseUI/Toast';
import { playMode } from '../../api/config';

function Player(props) {

//mock一份playList，后面直接从 redux 拿，现在只是为了调试播放效果。
const playList = [
    {
      ftype: 0,
      djId: 0,
      a: null,
      cd: '01',
      crbt: null,
      no: 1,
      st: 0,
      rt: '',
      cf: '',
      alia: [
        '手游《梦幻花园》苏州园林版推广曲'
      ],
      rtUrls: [],
      fee: 0,
      s_id: 0,
      copyright: 0,
      h: {
        br: 320000,
        fid: 0,
        size: 9400365,
        vd: -45814
      },
      mv: 0,
      al: {
        id: 84991301,
        name: '拾梦纪',
        picUrl: 'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
        tns: [],
        pic_str: '109951164627180052',
        pic: 109951164627180050
      },
      name: '拾梦纪',
      l: {
        br: 128000,
        fid: 0,
        size: 3760173,
        vd: -41672
      },
      rtype: 0,
      m: {
        br: 192000,
        fid: 0,
        size: 5640237,
        vd: -43277
      },
      cp: 1416668,
      mark: 0,
      rtUrl: null,
      mst: 9,
      dt: 234947,
      ar: [
        {
          id: 12084589,
          name: '妖扬',
          tns: [],
          alias: []
        },
        {
          id: 12578371,
          name: '金天',
          tns: [],
          alias: []
        }
      ],
      pop: 5,
      pst: 0,
      t: 0,
      v: 3,
      id: 1416767593,
      publishTime: 0,
      rurl: null
    }
];

    const {
        fullScreen,
        playing,
        currentSong,
        currentIndex,
        mode,
        sequencePlayList
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
    
    const audioRef = useRef();
    const toastRef = useRef();

    //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
    const [preSong, setPreSong] = useState({});

    const clickPlaying = (e, state) => {
        e.stopPropagation();
        togglePlayingDispatch(state);
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
        changeCurrentIndexDispatch(0);
    }, [])

    useEffect(() => {
        if (
            !playList.length ||
            currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id) 
            return;
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
        // 从头开始播放
        setCurrentTime(0);
        // 时长
        setDuration((current.dt / 1000) | 0);
    }, [playList, currentIndex]);

    useEffect(() => {
        playing ? audioRef.current.play() : audioRef.current.pause();
    }, [playing]);



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
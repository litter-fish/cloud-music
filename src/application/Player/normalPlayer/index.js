import React, { useRef } from 'react';
import { 
    NormalPlayerContainer,
    Top,
    Middle,
    Bottom,
    CDWrapper,
    Operators,
    ProgressWrapper
} from './style';
import {
    getName,
    formatPlayTime
} from '../../../api/utils';
import {
    CSSTransition
} from 'react-transition-group';
import animations from 'create-keyframe-animation';
import ProgressBar from '../../../baseUI/progressBar';
import { playMode } from './../../../api/config';
import Toast from '../../../baseUI/Toast';

function NormalPlayer(props) {
    const {
        song,
        fullScreen,
        playing,
        percent,
        duration,
        currentTime,
        mode
    } =  props;
    const {
        toggleFullScreen,
        clickPlaying,
        onProgressChange,
        handlePrev,
        handleNext
    } = props;
    const normalPlayerRef = useRef();
    const cdWrapperRef = useRef();


    const enter = () => {
        normalPlayerRef.current.style.display = 'block';
        // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
        const {x, y, scale} = _getPosAndScale();
        const animation = {
            0: {
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            }, 60: {
                transform: `translate3d($0, 0, 0) scale(1.1)`
            }, 100: {
                transform: `translate3d($0, 0, 0) scale(1)`
            }
        };
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 400,
                easing: 'linear'
            }
        });
        animations.runAnimation(cdWrapperRef.current, 'move');
    }

    // 计算偏移
    const _getPosAndScale = () => {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {
            x,
            y,
            scale
        }
    }

    const afterEnter = () => {
        animations.unregisterAnimation('move');
        cdWrapperRef.current.style.animation = '';
    }

    const leave = () => {
        if (!cdWrapperRef.current) return;
        cdWrapperRef.current.style.transition = 'all 0.4s';
        const {x, y, scale} = _getPosAndScale();
        cdWrapperRef.current.style['transform'] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
    const afterLeave = () => {
        if (!cdWrapperRef.current) return;
        cdWrapperRef.current.style.transition = '';
        cdWrapperRef.current.style['transform'] = '';
        // ????
        /*
            一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍 
            不置为 none 现在全屏播放器页面还是存在
         */
        normalPlayerRef.current.style.display = 'none';
    }
    const getPlayMode = () => {
        let content;
        if (mode === playMode.sequence) {
            content = "&#xe625;";
        } else if (mode === playMode.loop) {
            content = "&#xe653;";
        } else {
            content = "&#xe61b;";
        }
        return content;
    }

    return (
        <CSSTransition
            classNames="normal"
            in={fullScreen}
            timeout={400}
            mountOnEnter
            onEnter={enter}
            onEntered={afterEnter}
            onExit={leave}
            onExited={afterLeave}
        >
            <NormalPlayerContainer ref={normalPlayerRef}>
                <div className="background">
                    <img
                        src={song.al.picUrl + "?param=300x300"}
                        width="100%"
                        height="100%"
                        alt="歌曲图片"
                        />
                </div>
                <div className="background layer"></div>
                <Top className="top">
                    <div className="back" onClick={() => toggleFullScreen(false)}>
                        <i className="iconfont">&#xe662;</i>
                    </div>
                    <h1 className="title">{song.name}</h1>
                    <h1 className="subtitle">{getName(song.ar)}</h1>
                </Top>
                <Middle>
                    <CDWrapper ref={cdWrapperRef}>
                        <div className="cd">
                            <img
                                className={`image play ${playing ? "" : "pause"}`}
                                src={song.al.picUrl + "?param=400x400"}
                                alt=""
                                />
                        </div>
                    </CDWrapper>
                </Middle>
                <Bottom className="bottom">
                    <ProgressWrapper>
                        <span className="time time-l">{formatPlayTime(currentTime)}</span>
                        <div className="progress-bar-wrapper">
                            <ProgressBar 
                                percent={percent}
                                percentChange={onProgressChange}
                            ></ProgressBar>
                        </div>
                        <div className="time time-r">{formatPlayTime(duration)}</div>
                    </ProgressWrapper>
                    <Operators>
                        <div className="icon i-left">
                            <i
                                className="iconfont"
                                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
                            ></i>
                        </div>
                        <div className="icon i-left" onClick={handlePrev}>
                            <i className="iconfont">&#xe6e1;</i>
                        </div>
                        <div className="icon i-center">
                            <i 
                                className="iconfont"
                                onClick={e => clickPlaying(e, !playing)}
                                dangerouslySetInnerHTML={{
                                    __html: playing ? "&#xe723;" : "&#xe731;"
                                }}
                            ></i>
                        </div>
                        <div className="icon i-right" onClick={handleNext}>
                            <i className="iconfont">&#xe718;</i>
                        </div>
                        <div className="icon i-right">
                            <i className="iconfont">&#xe640;</i>
                        </div>
                    </Operators>
                </Bottom>
            </NormalPlayerContainer>
        </CSSTransition>
    );
}

export default React.memo(NormalPlayer);
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux'
import {
    CSSTransition
} from 'react-transition-group';
import  Header  from '../../base-ui/header/index';
import { 
    Container,
    ImgWrapper,
    CollectButton,
    BgLayer,
    SongListWrapper
} from './style';
import Scroll from '../../base-ui/scroll';
import Loading from '../../base-ui/loading';
import SongsList from '../song-list';
import { HEADER_HEIGHT } from '../../api/config';
import {
    changeEnterLoading,
    getSingerInfo
} from './store/actionCreators';
import MusicNote from '../../base-ui/music-note';

function Singer(props) {

    const { artist, songsOfArtist, enterLoading } = props;
    const { getSingerDataDispatch } = props;

    const [showStatus, setShowStatus] = useState(true);

    const collectButton = useRef();
    const imageWrapper = useRef();
    const songScrollWrapper = useRef();
    const songScroll = useRef();
    const header = useRef();
    const layer = useRef();
    // 图片初始高度
    const initialHeight = useRef(0);

    // 往上偏移的尺寸，露出圆角
    const OFFSET = 5;

    const musicNoteRef = useRef();

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({ x, y });
    };

    useEffect(() => {
        const id = props.match.params.id;
        getSingerDataDispatch(id);
    }, [])

    useEffect(() => {
        let h = imageWrapper.current.offsetHeight;
        songScrollWrapper.current.style.top = `${h - OFFSET}px`;
        initialHeight.current = h;
        layer.current.style.top = `${h - OFFSET}px`;
        songScroll.current.refresh();
    }, []);



    const handleScroll = useCallback((pos) => {
        let height = initialHeight.current;
        const newY = pos.y;
        const imageDOM = imageWrapper.current;
        const buttonDOM = collectButton.current;
        const headerDOM = header.current;
        const layerDOM = layer.current;
        const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

        // 指的是滑动距离占图片高度的百分比
        const percent = Math.abs(newY / height);

        // 往下拉的情况，效果：图片放大，按钮跟着偏移
        if (newY > 0) {
            imageDOM.style['transform'] = `scaleY(${1 + percent})`;
            buttonDOM.style['transform'] = `translate3d(0, ${newY}px ,0)`;
            layerDOM.style.top = `${height - OFFSET + newY}px`;
        } else if (newY >= minScrollY) { // 往上滑动，但是遮罩还没超过 Header 部分
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
            // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
            layerDOM.style.zIndex = 1;
            imageDOM.style.paddingTop = '75%';
            imageDOM.style.height = 0;
            imageDOM.style.zIndex = -1;
            // 按钮跟着移动且渐渐变透明
            buttonDOM.style['transform'] = `translate3d(0, ${newY}px ,0)`;
            buttonDOM.style['opacity'] = `${1 - percent * 2}`;
        } else if (newY < minScrollY) { // 往上滑动，但是遮罩超过 Header 部分
            layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
            layerDOM.style.zIndex = 1;
            // 防止溢出的歌单内容遮住 Header
            headerDOM.style.zIndex = 100;
            // 此时图片高度与 Header 一致
            imageDOM.style.height = `${HEADER_HEIGHT}px`;
            imageDOM.style.paddingTop = 0;
            imageDOM.style.zIndex = 99;
        }
    }, [])

    const handleBack = useCallback(() => {
        setShowStatus(false);
    }, []);

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container>
                <Header
                    ref={header}
                    title={"头部"}
                    handleClick={handleBack}
                ></Header>
                <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
                    <div className="filter"></div>
                </ImgWrapper>
                <CollectButton ref={collectButton}>
                    <i className="iconfont">&#xe62d;</i>
                    <span className="text"> 收藏 </span>
                </CollectButton>
                <BgLayer ref={layer}></BgLayer>
                <SongListWrapper ref={songScrollWrapper}>
                    <Scroll onScroll={handleScroll} ref={songScroll}>
                        <SongsList
                            songs={songsOfArtist}
                            showCollect={false}
                            musicAnimation={musicAnimation}
                        ></SongsList>
                    </Scroll>
                </SongListWrapper>
                <Loading show={enterLoading}></Loading>
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>

    );
}

const mapStateToProps = (state) => ({
    artist: state.getIn(['singer', 'artist']).toJS(),
    songsOfArtist: state.getIn(['singer', 'songsOfArtist']).toJS(),
    enterLoading: state.getIn(['singer', 'enterLoading'])
});

const mapDispatchToProps = (dispatch) => {
    return {
        getSingerDataDispatch(id) {
            dispatch(changeEnterLoading(true));
            dispatch(getSingerInfo(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Singer);
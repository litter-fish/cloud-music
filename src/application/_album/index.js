import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux'
import {
    Container,
    TopDesc,
    Menu,
    SongList,
    SongItem
} from './style';
import {
    CSSTransition
} from 'react-transition-group';
import  Header  from './../../base-ui/header/index';

import Scroll from '../../base-ui/scroll';
import {
    isEmptyObject
} from '../../api/utils';
import style from '../../assets/global-style';
import { 
    changeEnterLoading,
    getAlbumList
} from './store/actionCreators';
import Loading from '../../base-ui/loading/index';
import MusicNote from '../../base-ui/music-note';
import SongsList from '../song-list';

export const HEADER_HEIGHT = 45;

function Album(props) {

    const id = props.match.params.id;

    const { currentAlbum, enterLoading } = props;
    const { getAlbumDataDispatch } = props;

    useEffect(() => {
        getAlbumDataDispatch(id);
    }, [getAlbumDataDispatch, id]);

    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState('歌单');
    const [isMarquee, setIsMarquee] = useState(false);// 是否跑马灯

    const headerEl = useRef();
    const musicNoteRef = useRef();

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({ x, y });
    };

    // 将传给子组件的函数用 useCallback 包裹
    // 如果不用 useCallback 包裹，父组件每次执行时会生成不一样的 handleBack 和 handleScroll 函数引用，那么子组件每一次 memo 的结果都会不一样，导致不必要的重新渲染
    const handleScroll = useCallback((pos) => {
        let minScrollY = -HEADER_HEIGHT;
        let percent = Math.abs(pos.y / minScrollY);
        let headerDom = headerEl.current;
        // 滑过顶部的高度开始变化
        if (pos.y < minScrollY) {
            headerDom.style.backgroundColor = style['theme-color'];
            headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
            setTitle(currentAlbum.name);
            setIsMarquee(true);
        } else {
            headerDom.style.backgroundColor = '';
            headerDom.style.opacity = 1;
            setTitle('歌单');
            setIsMarquee(false);
        }
    }, [currentAlbum]);

    const handleBack = useCallback(() => {
        setShowStatus(false);
    }, []);

    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbum.coverImgUrl}>
                <div className='background'>
                    <div className='filter'></div>
                </div>
                <div className='img_wrapper'>
                    <div className='decorate'></div>
                    <img src={`${currentAlbum.coverImgUrl}?param=120x120`} alt=''/>
                    <div className='play_count'>
                        <i className='iconfont play'>&#xe885;</i>
                        <span className='count'>{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
                    </div>
                </div>
                <div className='desc_wrapper'>
                    <div className='title'>{currentAlbum.name}</div>
                    <div className='person'>
                        <div className='avatar'>
                            <img src={currentAlbum.creator.avatarUrl} alt=''/>
                        </div>
                        <div className='name'>{currentAlbum.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        );
    }

    const renderMenu = () => {
        return (
            <Menu>
                <div>
                    <i className='iconfont'>&#xe6ad;</i>
                    评论
                </div>
                <div>
                    <i className='iconfont'>&#xe86f;</i>
                    点赞
                </div>
                <div>
                    <i className='iconfont'>&#xe62d;</i>
                    收藏
                </div>
                <div>
                    <i className='iconfont'>&#xe606;</i>
                    更多
                </div>
            </Menu>
        );
    }

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames='fly'
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container>
                <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
                {
                    !isEmptyObject (currentAlbum) ?
                        <Scroll bounceTop={false} onScroll={handleScroll}>
                            <div>
                                { renderTopDesc() }
                                { renderMenu() }
                                <SongsList
                                    songs={currentAlbum.tracks}
                                    showCollect={true}
                                    musicAnimation={musicAnimation}
                                ></SongsList>
                            </div>
                        </Scroll> :
                        null
                }
                <Loading show={ enterLoading }></Loading>
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
    )
}

const mapStateToProps =  (state) => ({
    currentAlbum: state.getIn(['album', 'currentAlbum']).toJS(),
    enterLoading: state.getIn(['album', 'enterLoading'])
});

const mapDispatchToProps = (dispatch) => {
    return {
        getAlbumDataDispatch(id) {
            dispatch(changeEnterLoading(true));
            dispatch(getAlbumList(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
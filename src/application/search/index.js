import React, { useCallback, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
    Container,
    ShortcutWrapper,
    HotKey,
    List,
    ListItem,
    SongItem
} from './style';

import SearchBox from '../../base-ui/search-box';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from '../../base-ui/scroll';
import {
    getHotKeyWords,
    changeEnterLoading,
    getSuggestList
} from './store/actionCreators';
import {
    getSongDetail
} from '../player/store/actionCreators';
import Loading from './../../base-ui/loading/index';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { getName } from '../../api/utils';
import MusicalNote from '../../base-ui/music-note';
import { useRef } from 'react';

function Search(props) {

    const {
        hotList, 
        enterLoading, 
        suggestList, 
        songsCount, 
        songsList
    } = props;

    const {
        getHotKeyWordsDispatch,
        changeEnterLoadingDispatch,
        getSuggestListDispatch,
        getSongDetailDispatch
    } = props;

    const [show, setShow] = useState(false);
    const [query, setQuery] = useState('');

    const musicNoteRef = useRef();

    // 组件初次渲染时，发送 Ajax 请求拿到热门列表
    useEffect(() => {
        setShow(true);
        if (!hotList.length) {
            getHotKeyWordsDispatch();
        }
    }, []);

    const searchBack = useCallback(() => {
        setShow(false);
    }, [])

    const handleQuery = (e) => {
        setQuery(e);
        if (!e) return;
        changeEnterLoadingDispatch(true);
        getSuggestListDispatch(e);
    }

    const selectItem = (e, id) => {
        getSongDetailDispatch(id);
        musicNoteRef.current.startAnimation(
            {
                x: e.nativeEvent.clientX, 
                y: e.nativeEvent.clientY
            }
        );
    }

    const renderHotKey = () => {
        return (
            <ul>
                {
                    hotList.map(item => {
                        return (
                            <li className='item' key={item.first} onClick={() => setQuery(item.first)}>
                                <span>{item.first}</span>
                            </li>
                        );
                    })
                }
            </ul>
        )
    };

    const renderSingers = () => {
        let singlers = suggestList.artists;
        if (!singlers || !singlers.length) return;
        return (
            <List>
                <h1 className='title'> 相关歌手 </h1>
                {
                    singlers.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + '' + index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                                <div className='img_wrapper'>
                                    <LazyLoad placeholder={<img width='100%' height='100%' src={require('./music.png')} alt='music'/>}>
                                        <img src={item.picUrl} width='100%' height='100%' alt='music'/>
                                    </LazyLoad>
                                </div>
                                <span className='name'> 歌手: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderAlbum = () => {
        let albums = suggestList.albums;
        if (!albums || !albums.length) return;
        return (
            <List>
                <h1 className='title'> 相关歌单 </h1>
                {
                    albums.map(({artist}, index) => {
                        return (
                            <ListItem key={artist.id + '' + index} onClick={() => props.history.push(`/album/${artist.id}`)}>
                                <div className='img_wrapper'>
                                    <LazyLoad placeholder={<img width='100%' height='100%' src={require('./music.png')} alt='music'/>}>
                                        <img src={artist.picUrl} width='100%' height='100%' alt='music'/>
                                    </LazyLoad>
                                </div>
                                <span className='name'> 歌单: {artist.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderSongs = () => {
        return (
            <SongItem style={{paddingLeft: '20px'}}>
                {
                    songsList.map(item => {
                        return (
                            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                                <div className='info'>
                                    <span>{item.name}</span>
                                    <span>
                                        { getName(item.artists) } - { item.album.name }
                                    </span>
                                </div>
                            </li>
                        )
                    })
                }
            </SongItem>
        )
    };

    return (
        <CSSTransition
            in={show}
            timeout={300}
            appear={true}
            classNames='fly'
            unmountOnExit
            onExited={() => props.history.goBack()}
        >
            <Container>
                <div className='search_box_wrapper'>    
                    <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
                </div>
                <ShortcutWrapper show={!query}>
                    <Scroll>
                        <div>
                            <HotKey>
                                <h1 className='title'> 热门搜索 </h1>
                                {renderHotKey()}
                            </HotKey>
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                <ShortcutWrapper  show={query}>
                    <Scroll onScroll={forceCheck}>
                        <div>
                            {renderSingers()}
                            {renderAlbum()}
                            {renderSongs()}
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                { enterLoading? <Loading></Loading> : null }
                <MusicalNote ref={musicNoteRef}></MusicalNote>
            </Container>
        </CSSTransition>
    );
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    hotList: state.getIn(['search', 'hotList']).toJS(),
    enterLoading: state.getIn(['search', 'enterLoading']),
    suggestList: state.getIn(['search', 'suggestList']).toJS(),
    songsCount: state.getIn(['player', 'playList']).size,
    songsList: state.getIn(['search', 'songsList']).toJS()
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getHotKeyWordsDispatch() {
            dispatch(getHotKeyWords());
        },
        changeEnterLoadingDispatch(data) {
            dispatch(changeEnterLoading(data))
        },
        getSuggestListDispatch(data) {
            dispatch(getSuggestList(data));
        },
        getSongDetailDispatch(id) {
            dispatch(getSongDetail(id));
        }
    }
};
// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Search);
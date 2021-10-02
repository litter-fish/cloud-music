import React, { useContext, useEffect, useState } from 'react';
import Horizen from '../../baseUI/horizen-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import {
    NavContainer,
    ListContainer,
    List,
    ListItem
} from './style'
import Scroll from '../../baseUI/scroll';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import {
    changePageCount,
    changePullDownLoading,
    changePullUpLoading,
    getHotSingerList,
    refreshMoreHotSingerList,
    refreshMoreSingerList,
    getSingerList
} from './store/actionCreators';
import { changeEnterLoading } from '../Recommend/store/actionCreators';
import LazyLoad, { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading';
import { CategoryDataContext, CHANGE_CATEGORY, CHANGE_ALPHA } from './data';

function Singers(props) {

    //let [category, setCategory] = useState('');
    //let [alpha, setAlpha] = useState('');

    const {data, dispatch} = useContext(CategoryDataContext);
    const {category, alpha} = data.toJS();

    const {
        singerList,
        pullUpLoading,
        pullDownLoading,
        pageCount,
        enterLoading
    } = props;

    const {
        updateDispatch,
        pullUpRefreshDispatch,
        pullDownRefreshDispatch,
        getHotSingerDispatch,
    }  = props;

    useEffect(() => {
        if (!singerList.size) {
            getHotSingerDispatch();
        }
    }, []);

    const handleUpdateCatetory = (val) => {
        //setCategory(val);
        dispatch({type: CHANGE_CATEGORY, data: val});
        updateDispatch(val, alpha);
    }

    const handleUpdateAlpha = (val) => {
        //setAlpha(val);
        dispatch({type: CHANGE_ALPHA, data: val});
        updateDispatch(category, val);
    }

    const handlePullUp = () => {
        pullUpRefreshDispatch(category, alpha, category === '', pageCount);
    };

    const handlePullDown = () => {
        pullDownRefreshDispatch(category, alpha);
    };

    const enterDetail = (id) => {
        props.history.push(`/singers/${id}`);
    }

    const renderSingerList = () => {
        return (
            <List>
                {
                    singerList.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + '' + index} onClick={() => enterDetail(item.id)}>
                                <div className="img_warpper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./singer.png')} alt="music" />}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        );
                    })
                }
            </List>
        );
    }

    return (
        <div>
            <NavContainer>
                <Horizen
                    list={categoryTypes}
                    title={"分类 (默认热门):"}
                    handleClick={(val) => handleUpdateCatetory(val)}
                    oldVal={category}
                    ></Horizen>
                <Horizen
                    list={alphaTypes}
                    title={"首字母:"}
                    handleClick={(val) => handleUpdateAlpha(val)}
                    oldVal={alpha}
                    ></Horizen>
            </NavContainer>
            <ListContainer>
                <Scroll 
                    onScroll={ forceCheck }
                    pullUp={ handlePullUp }
                    pullDown = { handlePullDown }
                    pullUpLoading = { pullUpLoading }
                    pullDownLoading = { pullDownLoading }
                >
                    { renderSingerList() }
                </Scroll>
                <Loading show={ enterLoading }></Loading>
            </ListContainer>
            { renderRoutes(props.route.routes) }
        </div>
    )
}


// 组件连接Redux

const mapStateToProps = (state) => ({
    singerList: state.getIn(['singers', 'singerList']).toJS(),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount'])
});

const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerDispatch() {
            dispatch(getHotSingerList());
        },
        // 改变分类
        updateDispatch(category, alpha) {
            dispatch(changePageCount(0));
            dispatch(changeEnterLoading(true));
            dispatch(getSingerList(category, alpha));
        },
        // 滑到最底部刷新部分的处理
        pullUpRefreshDispatch(category, alpha, hot, count) {
            dispatch(changePullUpLoading(true));
            dispatch(changePageCount(count + 1));
            hot ?
                dispatch(refreshMoreHotSingerList()) :
                dispatch(refreshMoreSingerList(category, alpha));
        },
        // 顶部下拉刷新
        pullDownRefreshDispatch(category, alpha) {
            dispatch(changePullDownLoading(true));
            dispatch(changePageCount(0));
            (category === '' && alpha === '') ?
                dispatch(getHotSingerList()) :
                dispatch(getSingerList(category, alpha));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Singers);
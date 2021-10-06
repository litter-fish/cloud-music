import React,{ useEffect } from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import * as actionTypes from './store/actionCreators';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import { Content } from './style';

// 引入 forceCheck 方法
import { forceCheck } from 'react-lazyload';

import Scroll from '../../base-ui/scroll';
import Loading from '../../base-ui/loading';

function Recommend(props) {

    const { bannerList, recommendList, enterLoading } = props;

    // 这里的属性来源？
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

    // 只运行一次的 effect（仅在组件挂载和卸载时执行）
    useEffect (() => {
        if (!bannerList.length) {
            getBannerDataDispatch();
        }
        if (!recommendList.length) {
            getRecommendListDataDispatch();
        }
    }, []);

    return (
        <Content>
            <Scroll onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerList}></Slider>
                    <RecommendList recommendList={recommendList}></RecommendList>
                </div>
            </Scroll>
            <Loading show={enterLoading}></Loading> 
            { renderRoutes (props.route.routes) }
        </Content>
    )
}

const mapStateToProps = (state) => ({
    bannerList: state.getIn(['recommend', 'bannerList']).toJS(),
    recommendList: state.getIn (['recommend', 'recommendList']).toJS(),
    enterLoading: state.getIn (['recommend', 'enterLoading'])
});

const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList());
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList());
        }
    }
}


//TODO 是否还需要使用memo进行包装？
export default connect(mapStateToProps, mapDispatchToProps)(Recommend);
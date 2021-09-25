import React,{ useEffect } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import { Content } from './style';

// 引入 forceCheck 方法
import { forceCheck } from 'react-lazyload';

import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';

function Recommend(props) {

    const { bannerList, recommendList, enterLoading } = props;

    // 这里的属性来源？
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

    // 只运行一次的 effect（仅在组件挂载和卸载时执行）
    useEffect (() => {
        if (!bannerList.size) {
            getBannerDataDispatch();
        }
        if (!recommendList.size) {
            getRecommendListDataDispatch();
        }
    }, []);

    const bannerListJS = bannerList ? bannerList.toJS () : [];
    const recommendListJS = recommendList ? recommendList.toJS () :[];

    return (
        <Content>
            <Scroll onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerListJS}></Slider>
                    <RecommendList recommendList={recommendListJS}></RecommendList>
                </div>
            </Scroll>
            { enterLoading ? <Loading></Loading> : null }
        </Content>
    )
}

const mapStateToProps = (state) => ({
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn (['recommend', 'recommendList']),
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));
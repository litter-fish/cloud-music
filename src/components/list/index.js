import React from 'react';
// 图片懒加载 - 只需显示视口内的图片即可，未显示的时候给它一个默认的 src
import LazyLoad from 'react-lazyload';

import { 
    ListWrapper,
    ListItem,
    List
  } from './style';

import { getCount } from '../../api/utils';

function RecommendList(props) {
    return (
        <ListWrapper>
            <h1 className="title"> 推荐歌单 </h1>
            <List>
                {
                    props.recommendList.map((item, index) => {
                        return (
                            <ListItem key={item.id + index}>
                                <div className="img_wrapper">
                                    <div className="decorate"></div>
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./music.png')} alt="music"/>}>
                                        <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music"/>
                                    </LazyLoad>   
                                    <div className="play_count">
                                        <i className="iconfont play">&#xe885;</i>
                                        <span className="count">{ getCount(item.playCount) }</span>
                                    </div>
                                </div>
                                <div className="desc">{item.name}</div>
                            </ListItem>
                        )
                    })
                }
            </List>
        </ListWrapper>
    )
}

export default React.memo(RecommendList);
import React, { useEffect } from 'react';
import { getRankList } from './store/actionCreators';
import { connect } from 'react-redux';
import { filterIndex, filterIdx } from '../../api/utils';
import {
    List,
    ListItem,
    Container,
    SongList
} from './style';
import Scroll, { forceCheck } from '../../baseUI/scroll';
// ????
import { renderRoutes } from 'react-router-config';
import { EnterLoading } from './../Singers/style';
import Loading from '../../baseUI/loading';

function Rank(props) {

    const { rankList, loading } = props;
    const { getRankListDataDispatch } = props;

    let globalStartIndex = filterIndex(rankList);
    let officialList = rankList.slice(0, globalStartIndex);
    let globalList = rankList.slice(globalStartIndex);

    useEffect(() => {
        if (!rankList.length)
            getRankListDataDispatch();
    }, []);

    const enterDetail = (detail) => {
        props.history.push (`/rank/${detail.id}`);
    }

    const renderRankList = (list, global) => {
        return (
            <List globalRank={global}>
                {
                    list.map(item => {
                        return (
                            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item)}>
                                <div className="img_wrapper">
                                    <img src={item.coverImgUrl} alt=""></img>
                                    <div className="decorate"></div>
                                    <span className="update_frequecy">{item.updateFrequecy}</span>
                                </div>
                                { renderSongList(item.tracks)  }
                            </ListItem>
                        )
                    })
                }
            </List>
        );
    }

    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>;
                    })
                }
            </SongList>
            ) : null;
    }

    let displayStyle = loading ? {"display":"none"} :  {"display": ""};
    return (
        <Container>
            <Scroll>
                <div>
                    <h1 className="offical" style={displayStyle}> 官方榜 </h1>
                    { renderRankList(officialList) }
                    <h1 className="global" style={displayStyle}> 全球榜 </h1>
                    { renderRankList(globalList, true) }
                    { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
                </div>
            </Scroll>
            { renderRoutes(props.route.routes)  }
        </Container>
    )
}


const mapStateToProps = (state) => ({
    rankList: state.getIn(['ranks', 'rankList']).toJS(),
    loading: state.getIn(['ranks', 'loading'])
});

const mapDispatchToProps = (dispatch) => {
    return { 
        getRankListDataDispatch() {
            dispatch(getRankList());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Rank);
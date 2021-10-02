import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux'
import {
    SongList,
    SongItem
} from './style';
import {
    getName,
    getCount,
    isEmptyObject
} from '../../api/utils';

const SongsList = React.forwardRef((props, refs) => {

    const { collectCount, showCollect, songs } = props;

    const totalCount = songs.length;

    const selectItem = () => {}

    const songList = (list) => {
        return list.map((item, index) => {
            return (
                <li key={item.id} onClick={(e) => selectItem(e, index)}>
                    <span className="index">{index + 1}</span>
                    <div className="info">
                        <span>{item.name}</span>
                        <span>
                            { item.ar ? getName(item.ar) : getName(item.artists) } - { item.al ? item.al.name : item.album.name }
                        </span>
                    </div>
                </li>
            );
        })
    }
    const collect = (count) => {
        return (
            <div className="add_list">
                <i className="iconfont">&#xe62d;</i>
                <span> 收藏 ({Math.floor (count/1000)/10} 万)</span>
            </div>
        )
    }

    return (
        <SongList ref={refs} showBackground={props.showBackground}>
            <div className="first_line" onClick={(e) => selectItem(e, 0)}>
                <div className="play_all">
                    <i className="iconfont">&#xe6e3;</i>
                    <span> 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
                </div>
                { showCollect ? collect(collectCount) : null }
            </div>
            <SongItem>
                { songList(songs) }
            </SongItem>
        </SongList>
    )
});

export default React.memo(SongsList)
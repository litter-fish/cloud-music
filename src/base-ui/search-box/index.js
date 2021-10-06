import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { debounce } from '../../api/utils';

const SearchBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    padding-right: 20px;
    height: 40px;
    background: ${style['theme-color']};
    .icon-back {
        font-size: 24px;
        color: ${style['font-color-light']};
    }
    .box {
        flex: 1;
        margin: 0 5px;
        line-height: 18px;
        background: ${style['theme-color']};
        color: ${style['highlight-background-color']};
        font-size: ${style['font-size-m']};
        outline: none;
        border: none;
        border-bottom: 1px solid ${style['border-color']};
        &::placeholder {
        color: ${style['font-color-light']};
        }
    }
    .icon-delete {
        font-size: 16px;
        color: ${style['background-color']};
    }
`;


function SearchBox(props) {

    const queryRef = useRef();
    const [query, setQuery] = useState('');
    const { newQuery } = props;
    const { handleQuery } = props;
    const displayStyle = query ? {display: 'block'}: {display: 'none'};

    useEffect(() => {
        // 进场时 input 框应该出现光标
        queryRef.current.focus();
    }, []);

    const handleChange = (e) => {
        // 监听 input 框的内容
        setQuery(e.currentTarget.value);
    }

    const clearQuery = () => {
        setQuery('');
        queryRef.current.focus();
    }

    /*
        把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。
        这种优化有助于避免在每次渲染时都进行高开销的计算。
        传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作
     */
    let handleQueryDebounce = useMemo(() => {
        return debounce(handleQuery, 500);
    }, [handleQuery]);

    useEffect(() => {
        handleQueryDebounce(query);
    }, [query]);

    useEffect (() => {
        if (newQuery !== query){
            setQuery (newQuery);
        }
    }, [newQuery]);
    
    return (
        <SearchBoxWrapper>
            <i className='iconfont icon-back' onClick={() => props.back()}>&#xe655;</i>
            <input ref={queryRef} className='box' placeholder='搜索歌曲、歌手、专辑' value={query} onChange={handleChange}/>
            <i className='iconfont icon-delete' onClick={clearQuery} style={displayStyle}>&#xe600;</i>
        </SearchBoxWrapper>
    )
}

export default React.memo(SearchBox);
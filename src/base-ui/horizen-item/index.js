import React, { memo, useEffect, useRef } from 'react';
import Scroll from '../scroll';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';
import style from '../../assets/global-style'

const List = styled.div`
    display: flex;
    align-items: center;
    height: 30px;
    overflow: hidden;
    >span: first-of-type {
        display: block;
        flex: 0 0 auto;
        padding: 5px 0;
        margin-right: 5px;
        color: grey;
        font-size: ${style['font-size-m']};
        vertical-align: middle;
    }
`;

const ListItem = styled.span`
    flex: 0 0 auto;
    font-size: ${style['font-size-m']};
    padding: 5px 8px;
    border-radius: 10px;
    &.selected {
        color: ${style['theme-color']};
        border: 1px solid ${style['theme-color']};
        opacity: 0.8;
    }
`;

function Horizen(props) {

    const { list, oldVal, title } = props;
    const { handleClick } = props;

    const Category = useRef(null);
    useEffect(() => {
        const categoryDom = Category.current;
        const tagElems = categoryDom.querySelectorAll('span');
        let totalWidth = 0;
        Array.from(tagElems).forEach(({offsetWidth})=> {
            totalWidth += offsetWidth;
        });
        categoryDom.style.width = `${totalWidth}px`;
    }, []);

    return (
        <Scroll direction={'horizental'}>
            <div ref={Category}>
                <List>
                    <span>{title}</span>
                    {
                        list.map(item => {
                            return (
                                <ListItem
                                    key={item.key}
                                    className={`${oldVal === item.key ? 'selected': ''}`} 
                                    onClick={() => handleClick(item.key)}
                                    >
                                    {item.name}
                                </ListItem>
                            )
                        })
                    }
                </List>
            </div>
        </Scroll>
    )
}

PropTypes.defaults = {
    list: [],
    oldVal: '',
    title: '',
    handleClick: null
}

Horizen.propTypes = {
    list: PropTypes.array,
    oldVal: PropTypes.string,
    title: PropTypes.string,
    handleClick: PropTypes.func
}

export default memo(Horizen);
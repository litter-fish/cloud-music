import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';

const ProgressBarWrapper = styled.div`
    height: 30px;
    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, .3);
        .progress {
            position: absolute;
            height: 100%;
            background: ${style['theme-color']};
        }
        .progress-btn-wrapper {
            position: absolute;
            left: -15px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn {
                position: relative;
                left: 7px;
                top: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid ${style['border-color']};
                border-radius: 50%;
                background: ${style['theme-color']};
            }
        }
    }
`;

function ProgressBar(props) {

    const [touch, setTouch] = useState({});
    const { percentChange } = props;
    const { percent } = props;

    const progressBar = useRef();
    const progress = useRef();
    const progressBtn = useRef();

    const progressBtnWidth = 16;

    useEffect(() => {
        if (percent >= 0 && percent <= 1 && !touch.initiated) {
            const barWidth = progressBar.current.clientWidth - progressBtnWidth;
            const offsetWidth = percent * barWidth;
            progress.current.style.width = `${offsetWidth}px`;
            progressBtn.current.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`;
        }
    }, [percent]);

    const _changePercent = () => {
        const barWidth = progressBar.current.clientWidth - progressBtnWidth;
        const curPercent = progress.current.clientWidth / barWidth;
        percentChange (curPercent);
    }

    const _offset = (offsetWidth) => {
        progress.current.style.width = `${offsetWidth}px`;
        progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
    }

    const progressTouchStart = (e) => {
        setTouch({
            initiated: true,
            startX: e.touches[0].pageX,
            left: progress.current.clientWidth
        });

    }
    const progressTouchMove = (e) => {
        if (!touch.initiated) return;
        // 滑动距离   
        const deltaX = e.touches [0].pageX - touch.startX;
        const barWidth = progressBar.current.clientWidth - progressBtnWidth;
        const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
        _offset(offsetWidth);
    }
    const progressTouchEnd = (e) => {
        setTouch(Object.assign(touch, {initiated: false}));
        _changePercent();
    }

    const progressClick = (e) => {
        const rect = progressBar.current.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        _offset(offsetWidth);
        _changePercent();
    }

    return (
        <ProgressBarWrapper>
            <div className="bar-inner" ref={progressBar} onClick={progressClick}>
                <div className="progress" ref={progress}></div>
                <div className="progress-btn-wrapper"
                    ref={progressBtn}
                    onTouchStart={progressTouchStart}
                    onTouchMove={progressTouchMove}
                    onTouchEnd={progressTouchEnd}
                >
                    <div className="progress-btn"></div>
                </div>
            </div>
        </ProgressBarWrapper>
    );
}

export default React.memo(ProgressBar);
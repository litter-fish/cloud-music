
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;
export default class Lyric {

    constructor(lrc, hanlder = () => {}) {
        this.lines = [];
        this.lrc = lrc;
        this.handler = hanlder;// 回调函数
        this.state = STATE_PAUSE;// 播放状态
        this.curLineIndex = 0;// 当前播放歌词所在的行数
        this.startStamp = 0;// 歌曲开始的时间戳
        this.initLines();
    }

    initLines(lrc) {
        const lines = this.lrc.split ('\n');
        lines.forEach(line => {
            let result = timeExp.exec(line);
            if (result) {
                // 去掉时间，去歌词文本
                const txt = line.replace(timeExp, '').trim();
                if (txt) {
                    if (result[3].length === 3) {
                        result[3] = result[3] / 10;
                    }
                    this.lines.push({
                        time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
                        txt
                    });
                }
            }
        });

        // 根据时间排序
        return this.lines.sort ((a, b) => {
            return a.time - b.time;
        });
    }

    play(offset = 0, isSeek = false) {
        if (!this.lines.length) {
            return;
        }
        this.state = STATE_PLAYING;
        // 找到当前所在的行
        this.curLineIndex = this.findcurLineIndex(offset);
        this.callHandler (this.curLineIndex-1);
        // 根据时间进度判断歌曲开始的时间戳
        this.startStamp = +new Date() - offset;
        if (this.curLineIndex < this.lines.length) {
            clearTimeout(this.timer);
            // 继续播放
            this.playRest(isSeek);
        }
    }

    findcurLineIndex(time) {
        for (let i = 0; i < this.lines.length; i++) {
            if (time <= this.lines[i].time) {
                return i
            }
        }
        return this.lines.length - 1
    }

    callHandler(i) {
        if (i < 0) {
            return
        }
        this.handler({
            txt: this.lines[i].txt,
            lineNum: i
        })
    }

    // 继续播放
    playRest(isSeek = false) {
        let line = this.lines[this.curLineIndex];
        let delay;
        if (isSeek) {
            delay = line.time - (+new Date() - this.startStamp);
        } else {
            // 拿到上一行的歌词开始时间，算间隔
            let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0;
            delay = line.time - preTime;
        }
        this.timer = setTimeout(() => {
            this.callHandler(this.curLineIndex++);
            if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
                this.playRest();
            }
        }, delay)
    }

    // 暂停、播放状态切换
    togglePlay(offset) {
        if (this.state === STATE_PLAYING) {
            this.stop()
        } else {
            this.state = STATE_PLAYING
            this.play(offset, true)
        }
    }

    stop() {
        this.state = STATE_PAUSE
        clearTimeout(this.timer)
    }

    seek(offset) {
        this.play(offset, true)
    }
}
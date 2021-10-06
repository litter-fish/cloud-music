import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/recommend/store/index';
import { reducer as singersReducer } from '../application/singers/store/index';
import { reducer as rankReducer } from '../application/rank/store/index';
import { reducer as albumReducer } from '../application/album/store/index';
import { reducer as singerReducer } from '../application/singer/store/index';
import { reducer as playerReducer } from '../application/player/store/index';
import { reducer as searchReducer } from '../application/search/store/index';

export default combineReducers({
    // 之后开发具体功能模块的时候添加reducer
    recommend: recommendReducer,
    singers: singersReducer, // 将Singers下的reducer注册到全局store
    ranks: rankReducer,
    album: albumReducer,
    singer: singerReducer,
    player: playerReducer,
    search: searchReducer
});
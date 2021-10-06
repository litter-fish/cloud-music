import React from 'react';
import { Redirect } from 'react-router-dom';
import Home from '../application/home';
import Recommend from '../application/recommend';
import Singers from '../application/singers';
import Rank from '../application/rank';
import Album from '../application/album';
import Singer from '../application/singer';
import Search from '../application/search';


export default [{
    path: '/',
    component: Home,
    routes: [
        {
            path: '/',
            exact: true,
            render: () => (
                <Redirect to={"/recommend"} />
            )
        },
        {
            path: '/recommend',
            component: Recommend,
            routes: [
                {
                    path: '/recommend/:id',
                    component: Album
                }
            ]
        },
        {
            path: '/singers',
            component: Singers,
            routes: [
                {
                    path: '/Singers/:id',
                    component: Singer
                }
            ]
        },
        {
            path: '/rank',
            component: Rank,
            routes: [
                {
                    path: "/rank/:id",
                    component: Album
                }
            ]
        },
        {
            path: "/album/:id",
            exact: true,
            key: "album",
            component: Album
        },
        {
            path: "/search",
            exact: true,
            key: "search",
            component: Search
        } 
    ]
}]
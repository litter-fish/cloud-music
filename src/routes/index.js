import React, { lazy, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import Home from '../application/home';
const RecommendComponent = lazy(() => import('../application/recommend'));
const SingersComponent = lazy(() => import('../application/singers'));
const RankComponent = lazy(() => import('../application/rank'));
const AlbumComponent = lazy(() => import('../application/album'));
const SingerComponent = lazy(() => import('../application/singer'));
const SearchComponent = lazy(() => import('../application/search'));

const SuspenseComponent = Component => props => {
    return (
        <Suspense fallback={null}>
            <Component {...props}></Component>
        </Suspense>
    )
}

export default [{
    path: '/',
    component: Home,
    routes: [
        {
            path: '/',
            exact: true,
            render: () => (
                <Redirect to={'/recommend'} />
            )
        },
        {
            path: '/recommend',
            component: SuspenseComponent(RecommendComponent),
            routes: [
                {
                    path: '/recommend/:id',
                    component: SuspenseComponent(AlbumComponent)
                }
            ]
        },
        {
            path: '/singers',
            component: SuspenseComponent(SingersComponent),
            routes: [
                {
                    path: '/Singers/:id',
                    component: SuspenseComponent(SingerComponent)
                }
            ]
        },
        {
            path: '/rank',
            component: SuspenseComponent(RankComponent),
            routes: [
                {
                    path: '/rank/:id',
                    component: SuspenseComponent(AlbumComponent)
                }
            ]
        },
        {
            path: '/album/:id',
            exact: true,
            key: 'album',
            component: SuspenseComponent(AlbumComponent)
        },
        {
            path: '/search',
            exact: true,
            key: 'search',
            component: SuspenseComponent(SearchComponent)
        } 
    ]
}]
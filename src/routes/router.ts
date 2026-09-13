import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import ExplorePage from './explore/ExplorePage.tsx';
import HomePage from './home/HomePage.tsx';

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$algorithmId',
  component: ExplorePage,
});

const routeTree = rootRoute.addChildren([homeRoute, exploreRoute]);

export const router = createRouter({ routeTree });

import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import HomePage from '#components/home/HomePage.tsx';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

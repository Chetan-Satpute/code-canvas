import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import HomePage from './home/HomePage';
import StructurePage from './structure/StructurePage';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const structureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$structureID',
  component: StructurePage,
});

const routeTree = rootRoute.addChildren([indexRoute, structureRoute]);

export const router = createRouter({ routeTree });

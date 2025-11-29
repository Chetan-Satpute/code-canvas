import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import HomePage from './home/HomePage';
import StructureLayout from './structure/StructureLayout';
import StructurePage from './structure/StructurePage';
import AlgorithmPage from './structure/algorithm/AlgorithmPage';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const structureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$structureID',
  component: StructureLayout,
});

const structureIndexRoute = createRoute({
  getParentRoute: () => structureRoute,
  path: '/',
  component: StructurePage,
});

const algorithmRoute = createRoute({
  getParentRoute: () => structureRoute,
  path: '$algorithmID',
  component: AlgorithmPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  structureRoute.addChildren([structureIndexRoute, algorithmRoute]),
]);

export const router = createRouter({ routeTree });

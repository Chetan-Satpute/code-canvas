import {
  createRootRoute,
  createRoute,
  createRouter,
  useParams,
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

// Route params are read through here so pages never bind to the router API.
export function useAlgorithmId() {
  const { algorithmId } = useParams({ from: exploreRoute.id });

  return algorithmId;
}

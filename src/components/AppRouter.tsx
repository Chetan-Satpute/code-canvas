import { RouterProvider } from '@tanstack/react-router';

import { router } from '#routes/router.ts';

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;

import { RouterProvider } from '@tanstack/react-router';

import { router } from '#routes/router.tsx';

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;

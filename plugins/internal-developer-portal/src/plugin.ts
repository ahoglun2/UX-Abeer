import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const internalDeveloperPortalPlugin = createPlugin({
  id: 'internal-developer-portal',
  routes: {
    root: rootRouteRef,
  },
});

export const InternalDeveloperPortalHomePage =
  internalDeveloperPortalPlugin.provide(
    createRoutableExtension({
      name: 'InternalDeveloperPortalHomePage',
      component: () => import('./components/Home/HomePage').then(m => m.HomePage),
      mountPoint: rootRouteRef,
    }),
  );

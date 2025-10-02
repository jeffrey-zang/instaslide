import { router } from '../trpc';
import { slideshowRouter } from './slideshow';
import { authRouter } from './auth';

export const appRouter = router({
  auth: authRouter,
  slideshow: slideshowRouter,
});

export type AppRouter = typeof appRouter;

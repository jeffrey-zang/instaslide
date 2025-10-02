import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const authRouter = router({
  signUp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user };
    }),

  signIn: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user };
    }),

  signOut: publicProcedure
    .mutation(async ({ ctx }) => {
      await ctx.supabase.auth.signOut();
      return { success: true };
    }),

  getUser: publicProcedure
    .query(async ({ ctx }) => {
      return { user: ctx.user };
    }),

  updateEmail: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.updateUser({
        email: input.email,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user };
    }),

  updatePassword: protectedProcedure
    .input(z.object({
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.updateUser({
        password: input.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user };
    }),
});

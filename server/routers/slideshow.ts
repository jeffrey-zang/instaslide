import { router, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const slideshowRouter = router({
  generateFromOutline: protectedProcedure
    .input(z.object({
      outline: z.string(),
      title: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Generate a Slidev markdown presentation based on this outline:

${input.outline}

${input.title ? `Title: ${input.title}` : ''}

Please create a complete Slidev markdown presentation with:
- A title slide
- Content slides with headers, bullet points, and formatting
- Use Slidev syntax (---, #, ##, etc.)
- Make it visually appealing and well-structured
- Include relevant content based on the outline

Return only the markdown content, no additional explanation.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating beautiful, well-structured presentations using Slidev markdown format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const markdown = completion.choices[0].message.content || '';

      return { markdown };
    }),

  save: protectedProcedure
    .input(z.object({
      title: z.string(),
      markdown: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('slideshows')
        .insert({
          title: input.title,
          markdown: input.markdown,
          user_id: ctx.user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { slideshow: data };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      markdown: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('slideshows')
        .update({
          title: input.title,
          markdown: input.markdown,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { slideshow: data };
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('slideshows')
        .select('*')
        .eq('user_id', ctx.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return { slideshows: data };
    }),

  get: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('slideshows')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { slideshow: data };
    }),

  getShared: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('slideshows')
        .select('*')
        .eq('id', input.id)
        .eq('is_public', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { slideshow: data };
    }),

  togglePublic: protectedProcedure
    .input(z.object({
      id: z.string(),
      isPublic: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('slideshows')
        .update({
          is_public: input.isPublic,
        })
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { slideshow: data };
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from('slideshows')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.user.id);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    }),
});

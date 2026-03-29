import { inngest } from '@/inngest/client';
import { protectedProcedure, createTRPCRouter } from '../init';

import prisma from '@/lib/prisma';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({




  getWorkflows: protectedProcedure.query(({ ctx }) => {

    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {

    await inngest.send({
      name: "test/hello.world",
      data: {
        name: "tester"
      }
    })

    return {
      success: true,
      message: "Workflow creation triggered"
    }
  }),



  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    })
    return {
      success: true,
      message: "job queued"
    }
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;
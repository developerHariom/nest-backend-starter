import { postByIdService, trendingPostsService } from "@/services/post";
import type { YogaContext } from "@/utils/types";

export const Query = {
  async post(
    _: unknown,
    { id }: { id: string },
    { prisma }: YogaContext,
    ___: unknown,
  ) {
    return await postByIdService(prisma, id);
  },
  async trendingPosts(
    _: unknown,
    __: unknown,
    { prisma }: YogaContext,
    ___: unknown,
  ) {
    return await trendingPostsService(prisma);
  },
};

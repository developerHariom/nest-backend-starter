import { type GraphQLResolveInfo } from "graphql";

import { AuthenticationError } from "@/model";
import {
  postCreationService,
  postDeletionService,
  postModificationService,
} from "@/services/post";

import type {
  CreatePostInput,
  UpdatePostInput,
  YogaContext,
} from "@/utils/types";

export const Mutation = {
  async createPost(
    _: unknown,
    { data }: { data: CreatePostInput },
    { prisma, user }: YogaContext,
    ___: GraphQLResolveInfo,
  ) {
  
    if (user === null) {
      return new AuthenticationError();
    }
    return await postCreationService(prisma, data);
  },

  async updatePost(
    _: unknown,
    { data }: { data: UpdatePostInput },
    { prisma, user }: YogaContext,
    ___: GraphQLResolveInfo,
  ) {
    if (user === null) {
      return new AuthenticationError();
    }
    return await postModificationService(prisma, data);
  },

  async deletePost(
    _: unknown,
    { id }: { id: string },
    { prisma, user }: YogaContext,
    ___: GraphQLResolveInfo,
  ) {
    if (user === null) {
      return new AuthenticationError();
    }
    return await postDeletionService(prisma, id);
  },
};

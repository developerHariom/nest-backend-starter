import { Prisma, PrismaClient } from "@prisma/client";

import type { CreatePostInput, UpdatePostInput } from "@/utils/types";

export function createPost(
  prisma: PrismaClient,

  {
    content,

    title,
  }: CreatePostInput,
) {
  return prisma.post.create({
    data: {
      title,
      content,
    },
  });
}

export function updatePost(
  prisma: PrismaClient,
  {
    id,

    content,

    title,
  }: UpdatePostInput,
) {
  return prisma.post.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
}

export function deletePost(prisma: PrismaClient, id: string) {
  return prisma.post.delete({
    where: { id },
  });
}

export function getAllPosts(
  prisma: PrismaClient,
  condition?: Prisma.PostFindManyArgs,
) {
  return prisma.post.findMany({
    ...condition,
  });
}

export function getPostById(prisma: PrismaClient, id: string) {
  return prisma.post.findUnique({ where: { id } });
}

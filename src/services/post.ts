import {  PrismaClient } from "@prisma/client";

import logger from "@/logger";
import { NoContentError, UnknownError } from "@/model";
import {

  createPost,
  deletePost,
  getAllPosts,
 
  getPostById,
 
  updatePost,
} from "@/repositories/post";
import { formatError} from "@/utils";
import {
 
  generateCreationErrorMessage,
  generateDeleteErrorMessage,
  generateFetchErrorMessage,
  generateNotExistErrorMessage,
  generateUpdateErrorMessage,
} from "@/utils/constants";

import type {
  CreatePostInput,
 
  UpdatePostInput,
 
} from "@/utils/types";
import {
  createPostSchema,
 
  updatePostSchema,
} from "@/validations/post";


export async function postCreationService(
  prisma: PrismaClient,
  params: CreatePostInput,
  
) {
  try {
    await createPostSchema.validate(params, { abortEarly: false });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "post creation" });
  }


  try {
    const {  ...rest } = params;


   
    
    return await createPost(prisma,  {
      ...rest,
    });
  } catch (error) {
    
    logger.error(error);
    return new UnknownError(generateCreationErrorMessage("Post"));
  }
}

export async function postModificationService(
  prisma: PrismaClient,
  params: UpdatePostInput,
 
) {
  try {
    await updatePostSchema.validate(params, { abortEarly: false });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "post modification" });
  }
  try {
    const {  ...rest } = params;
    const isExist = await getPostById(prisma, rest.id);

    if (!isExist) {
      return new NoContentError(generateNotExistErrorMessage("Post"));
    }

   
    return await updatePost(prisma, {
      ...rest,
     
    });
  } catch (error) {
   
    logger.error(error);
    return new UnknownError(generateUpdateErrorMessage("Post"));
  }
}

export async function postDeletionService(
  prisma: PrismaClient,
  id: string,
 
) {
  try {
    const isExist = await getPostById(prisma, id);

    if (!isExist) {
      return new NoContentError(generateNotExistErrorMessage("Post"));
    }

    const deletedPost = await deletePost(prisma, id);
    return deletedPost.id;
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateDeleteErrorMessage("Post"));
  }
}

export async function postByIdService(prisma: PrismaClient, id: string) {
  try {
    const result = await getPostById(prisma, id);
    return result;
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateNotExistErrorMessage("Post"));
  }
}

export async function trendingPostsService(prisma: PrismaClient) {
  try {
    return await getAllPosts(prisma, {
      take: 6,
    });
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateFetchErrorMessage("posts"));
  }
}

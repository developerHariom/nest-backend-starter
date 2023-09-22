import { YogaInitialContext } from "graphql-yoga";

import type { User } from "@prisma/client";
import type { Request, Response } from "express";
import type { InferType } from "yup";

import {
  cursorParamsSchema,
  fileParamsSchema,
  idParamsSchema,
  imageParamsSchema,
  offsetParamsSchema,
} from "@/validations";
import { createPostSchema, updatePostSchema } from "@/validations/post";
import {
  loginSchema,
  registerSchema,
  verifyCodeSchema,
  verifyUserSchema,
} from "@/validations/user";

import createContext from "./context";

export type YogaContextType = YogaInitialContext & {
  req: Request;
  res: Response;
};
export type YogaContext = ReturnType<typeof createContext>;

export type CursorParams = InferType<typeof cursorParamsSchema>;
export type OffsetParams = InferType<typeof offsetParamsSchema>;
export type IDParams = InferType<typeof idParamsSchema>;
export type ImageParams = InferType<typeof imageParamsSchema>;
export type FileParams = InferType<typeof fileParamsSchema>;

// User Type
export type UserWithAvatar = User;
export type RegisterInput = InferType<typeof registerSchema>;
export type LoginInput = InferType<typeof loginSchema>;

export type VerifyCodeParams = InferType<typeof verifyCodeSchema>;
export type VerifyUserParams = InferType<typeof verifyUserSchema>;

// Post Type
export type CreatePostInput = InferType<typeof createPostSchema>;
export type UpdatePostInput = InferType<typeof updatePostSchema>;

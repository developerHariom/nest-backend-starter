import { YogaInitialContext } from "graphql-yoga";
import type { Request, Response } from "express";
import type { InferType } from "yup";

import { idParamsSchema } from "@/validations";
import { createPostSchema, updatePostSchema } from "@/validations/post";
import { sellerLoginSchema, sellerRegisterSchema } from "@/validations/seller";
import {
  loginSchema,
  registerSchema,
 
} from "@/validations/user";

import createContext from "./context";
import { createProductSchema } from "@/validations/product";

export type YogaContextType = YogaInitialContext & {
  req: Request;
  res: Response;
};
export type YogaContext = ReturnType<typeof createContext>;

export type IDParams = InferType<typeof idParamsSchema>;


export type RegisterInput = InferType<typeof registerSchema>;
export type LoginInput = InferType<typeof loginSchema>;

// Post Type
export type CreatePostInput = InferType<typeof createPostSchema>;
export type UpdatePostInput = InferType<typeof updatePostSchema>;

// Seller Type
export type SellerRegisterInput = InferType<typeof sellerRegisterSchema>;
export type SellerLoginInput = InferType<typeof sellerLoginSchema>;


// Product Type
export type CreateProductInput=InferType<typeof  createProductSchema>

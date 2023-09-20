import { AuthenticationError } from "@/model";
import {
 
  tokenService,
  userService,
 
} from "@/services/user";
import { UN_AUTH_ERR_MSG, } from "@/utils/constants";
import {
  
  YogaContext,
} from "@/utils/types";

export const Query = {
  async token(
    _: unknown,
    { refreshToken }: { refreshToken?: string },
    { prisma, req }: YogaContext,
  ) {
   
    return await tokenService(prisma, refreshToken || req.cookies?.jwt);
  },


  async user(
    _: unknown,
    { id }: { id: string },
    { prisma, user }: YogaContext,
  ) {
    if (user === null) {
      return new AuthenticationError(UN_AUTH_ERR_MSG);
    }

    return await userService(prisma, id);
  },
}
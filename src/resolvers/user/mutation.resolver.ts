import { type GraphQLResolveInfo } from "graphql";

import { AuthenticationError } from "@/model";
import {
  loginService,
  logoutService,
  userRegistrationService,
} from "@/services/user";
import { UN_AUTH_ERR_MSG } from "@/utils/constants";
import type { LoginInput, RegisterInput, YogaContext } from "@/utils/types";

export const Mutation = {
  async register(
    _: unknown,
    { data }: { data: RegisterInput },
    { prisma }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    return await userRegistrationService(prisma, data);
  },

  async login(
    _: unknown,
    { data }: { data: LoginInput },
    { prisma, res }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    return await loginService(prisma, data, res);
  },

  async logout(
    _: unknown,
    __: unknown,
    { user, req, res }: YogaContext,
    ___: GraphQLResolveInfo,
  ) {
    if (user === null) {
      return new AuthenticationError(UN_AUTH_ERR_MSG);
    }
    return await logoutService(user, req, res);
  },
};

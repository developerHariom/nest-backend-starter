import { type GraphQLResolveInfo } from "graphql";

import { AuthenticationError } from "@/model";
import {
  loginService,
  logoutService,
  resendActivationService,
  userRegistrationService,
  verifyUserService,
} from "@/services/user";
import { UN_AUTH_ERR_MSG } from "@/utils/constants";
import type {
  IDParams,
  LoginInput,
  RegisterInput,
  VerifyUserParams,
  YogaContext,
} from "@/utils/types";

export const Mutation = {
  async register(
    _: unknown,
    { data }: { data: RegisterInput },
    { prisma }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    console.log(data);
    return await userRegistrationService(prisma, data);
  },

  async resendActivation(
    _: unknown,
    params: IDParams,
    { prisma }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    const result = await resendActivationService(prisma, params);
    return result;
  },

  async verifyUser(
    _: unknown,
    params: VerifyUserParams,
    { prisma, pubSub }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    const verifiedUserId = await verifyUserService(prisma, params);

    if (typeof verifiedUserId === "string") {
      pubSub.publish("verifyUser", verifiedUserId, {
        mutation: "VERIFIED",
        userId: verifiedUserId,
      });
    }

    return verifiedUserId;
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

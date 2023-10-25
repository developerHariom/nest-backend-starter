import { type GraphQLResolveInfo } from "graphql";

import {
  sellerLoginService,
  sellerRegisterationService,
} from "@/services/seller";
import { SellerRegisterInput } from "@/utils/types";
import type { SellerLoginInput, YogaContext } from "@/utils/types";

export const Mutation = {
  async sellerRegister(
    _: unknown,
    { data }: { data: SellerRegisterInput },
    { prisma }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    return await sellerRegisterationService(prisma, data);
  },

  async sellerLogin(
    _: unknown,
    { data }: { data: SellerLoginInput },
    { prisma, res }: YogaContext,
    __: GraphQLResolveInfo,
  ) {
    return await sellerLoginService(prisma, data, res);
  },
};

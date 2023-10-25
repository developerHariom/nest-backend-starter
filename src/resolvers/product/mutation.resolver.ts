import { type GraphQLResolveInfo } from "graphql";

import { CreateProductInput } from "@/utils/types";
import type { YogaContext } from "@/utils/types";
import { AuthenticationError, ForbiddenError } from "@/model";
import { productCreationService } from "@/services/product";
import { VERIFIED_SELLER_ERROR_MESSAGE } from "@/utils/constants";

export const Mutation = {
  async createProduct(
    _: unknown,
    { data }: { data: CreateProductInput },
    { prisma, user }: YogaContext,
    ___: GraphQLResolveInfo,
  ) {

    if (user === null) {
        return new AuthenticationError();
      }

    //   console.log(data)
    if (user.role !=="SELLER") {
      return new ForbiddenError(VERIFIED_SELLER_ERROR_MESSAGE);
    }

      return await productCreationService(prisma, data,user?.id);
  },
  
};

import { getAllProductsService } from "@/services/product";
import type { YogaContext } from "@/utils/types";

export const Query = {
  async getAllProducts(
    _: unknown,
    __: unknown,
    { prisma }: YogaContext,
    ___: unknown,
  ) {
    console.log("Getall")
    return await getAllProductsService(prisma);
  },
};

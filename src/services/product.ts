import { PrismaClient } from "@prisma/client";

import logger from "@/logger";
import { UnknownError } from "@/model";
import { createProduct, getAllProducts } from "@/repositories/product";
import { formatError } from "@/utils";
import {
  generateCreationErrorMessage,
  generateFetchErrorMessage,
} from "@/utils/constants";
import redisClient from "@/utils/redis";
import { CreateProductInput } from "@/utils/types";
import { createProductSchema } from "@/validations/product";

export async function productCreationService(
  prisma: PrismaClient,
  params: CreateProductInput,
  sellerId: string,
) {
  try {
    await createProductSchema.validate(params, { abortEarly: false });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "post creation" });
  }

  try {
    const { ...rest } = params;

    const products = await createProduct(prisma, sellerId, {
      ...rest,
    });

    return products;
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateCreationErrorMessage("Product"));
  }
}

export async function getAllProductsService(prisma: PrismaClient) {
  try {
    console.log("ya ta xire");
    const cachedProducts = await redisClient.get("allProducts");
    if (cachedProducts) {
      console.log("cached diyo");
      return JSON.parse(cachedProducts);
    } else {
      console.log("vtra xirexa");
      const products = await getAllProducts(prisma);
      redisClient.set("allProducts", JSON.stringify(products), "EX", 300);
      return products;
    }
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateFetchErrorMessage("Products"));
  }
}

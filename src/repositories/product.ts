import { PrismaClient } from "@prisma/client";

import logger from "@/logger";
import { UnknownError } from "@/model";
import { generateCreationErrorMessage } from "@/utils/constants";
import { CreateProductInput } from "@/utils/types";

export async function createProduct(
  prisma: PrismaClient,
  sellerId: string,
  {
    name,
    category,
    description,
    discountPrice,
    images,
    originalPrice,
    stock,
  }: CreateProductInput,
) {
  console.log(
    name,
    category,
    description,
    discountPrice,
    images,
    originalPrice,
    stock,
  );

  const imagesData = images
    ? images.map((image) => ({
      public_id: image.public_id,
      imgSrc: image.imgSrc,
    }))
    : [];

  try {
    const createdProduct = await prisma.product.create({
      data: {
        name,
        seller: {
          connect: {
            id: sellerId,
          },
        },
        category,
        description,
        discountPrice,
        originalPrice,
        stock,
        images: {
          create: imagesData.map((imageData) => ({
            public_id: imageData.public_id,
            imgSrc: imageData.imgSrc,
          })),
        },
      },
      include: {
        images: true,
        seller: true,
      },
    });

    return { ...createdProduct };
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateCreationErrorMessage("Product"));
  }
}

export function getAllProducts(prisma: PrismaClient) {
  const products = prisma.product.findMany({
    include: {
      images: true,
      seller: true,
    },
  });


  return products;
}

import { PrismaClient } from "@prisma/client";

import { SellerRegisterInput } from "@/utils/types";

export async function getSellerByEmail(
  prisma: PrismaClient,
  email: string,
  
) {
  return await prisma.seller.findFirst({
    where: {
      email
    }
  });
}

export function createSeller(
  prisma: PrismaClient,
  {
    email,
    contact,
    password,
    firstName,
    lastName,
    address,
    country,
    shopAddress,
    shopName,
  }: Omit<SellerRegisterInput, "confirmPassword">,
) {
  return prisma.seller.create({
    data: {
      email,
      contact,
      password,
      firstName,
      lastName,
      address,
      country,
      shopAddress,
      shopName,
      role: "SELLER",
    },
  });
}

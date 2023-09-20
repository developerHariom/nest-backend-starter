import {  PrismaClient } from "@prisma/client";



import type {  RegisterInput } from "@/utils/types";

export function createUser(
  prisma: PrismaClient,
  { email, mobile, password, name }: Omit<RegisterInput, "confirmPassword">,
) {
  return prisma.user.create({
    data: {
      email,
      mobile,
      password,
      name,
      role: "AUTHOR",
      authorStatus: "PENDING",
    },
  });
}


export function updateAuthorStatusToVerified(prisma: PrismaClient, id: string) {
  return prisma.user.update({
    data: { authorStatus: "VERIFIED" },
    where: { id },
  });
}

export async function getUserByEmailOrMobile(
  prisma: PrismaClient,
  email: string,
  mobile: string,
) {
  return await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
  });
}

export function getUserById(prisma: PrismaClient, id: string) {
  return prisma.user.findUnique({ where: { id } });
}
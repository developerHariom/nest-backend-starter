import { PrismaClient } from "@prisma/client";
import { hash, verify } from "argon2";
import { Response } from "express";
import ms from "ms";

import logger from "@/logger";
import {
  AuthenticationError,
  ForbiddenError,
  UnknownError,
  UserInputError,
} from "@/model";
import { sendMail } from "@/repositories/mail";
import { createSeller, getSellerByEmail } from "@/repositories/seller";
import { formatError } from "@/utils";
import config from "@/utils/config";
import {
  AUTH_FAIL_ERR_MSG,
  INVALID_CREDENTIAL,
  generateNotExistErrorMessage,
} from "@/utils/constants";
import { SellerLoginInput, SellerRegisterInput } from "@/utils/types";
import { sellerLoginSchema, sellerRegisterSchema } from "@/validations/seller";

import { generateTokensService } from "./user";

export async function sellerRegisterationService(
  prisma: PrismaClient,
  params: SellerRegisterInput,
) {
  try {
    await sellerRegisterSchema.validate(params, {
      abortEarly: false,
    });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "register user" });
  }

  try {
    const {
      email,
      password,
      address,
      contact,
      country,
      firstName,
      lastName,
      shopAddress,
      shopName,
    } = params;

    const isSellerExist = await getSellerByEmail(prisma, email);

    if (isSellerExist) {
      throw new AuthenticationError("Seller with email Already Exist");
    }

    const hashPassword = await hash(password);

    const seller = await createSeller(prisma, {
      email,
      contact,
      firstName,
      lastName,
      address,
      country,
      shopAddress,
      shopName,
      password: hashPassword,
    });
    await sendMail({
      email: email,
      subject: "Thanks For Becoming Part Of Shop-0",
      message: `Hello ${firstName}`,
    });

    return seller.id;
  } catch (error: any) {
    logger.error(error);
    return new UnknownError(error);
  }
}

export async function sellerLoginService(
  prisma: PrismaClient,
  params: SellerLoginInput,
  res: Response,
) {
  try {
    await sellerLoginSchema.validate(params, {
      abortEarly: false,
    });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "Seller Login" });
  }

  try {
    const { email } = params;
    const seller = await getSellerByEmail(prisma, email);

    if (!seller) {
      return new ForbiddenError(generateNotExistErrorMessage("Seller"));
    }

    const isValidPassword = await verify(seller.password, params.password);

    if (!isValidPassword) {
      return new UserInputError(INVALID_CREDENTIAL);
    }

    const { accessToken, refreshToken } = await generateTokensService(seller);
    res.cookie("accessToken",accessToken,{
      maxAge: ms(config.ACCESS_TOKEN_EXPIRES),
    })
    res.cookie("role",seller?.role,{
      maxAge: ms(config.ACCESS_TOKEN_EXPIRES),
    })
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms(config.REFRESH_TOKEN_EXPIRES),
    });
    return {seller}
  } catch (error) {
    logger.error(error);
    return new UnknownError(AUTH_FAIL_ERR_MSG);
  }
}

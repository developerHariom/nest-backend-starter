import { PrismaClient, Seller, User } from "@prisma/client";
import { hash, verify } from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ms from "ms";

import logger from "@/logger";
import {
  AuthenticationError,
  ForbiddenError,
  UnknownError,
  UserInputError,
} from "@/model";
import {
  createUser,
  getUserByEmailOrMobile,
  getUserById,
} from "@/repositories/user";
import { formatError, generateToken, getUserPayload } from "@/utils";
import config from "@/utils/config";
import {
  AUTH_FAIL_ERR_MSG,
  INVALID_CREDENTIAL,
  UN_AUTH_ERR_MSG,
  generateCreationErrorMessage,
  generateFetchErrorMessage,
  generateNotExistErrorMessage,
} from "@/utils/constants";
import type { LoginInput, RegisterInput } from "@/utils/types";
import { loginSchema, registerSchema } from "@/validations/user";

export async function generateTokensService(user: User | Seller) {
  const accessToken = await generateToken(
    user,
    config.ACCESS_TOKEN_SECRET_KEY,
    config.ACCESS_TOKEN_EXPIRES,
  );

  const refreshToken = await generateToken(
    user,
    config.REFRESH_TOKEN_SECRET_KEY,
    config.REFRESH_TOKEN_EXPIRES,
  );

  return { accessToken, refreshToken } as const;
}

const verifyRefreshToken = async (token: string) => {
  console.log(token, "verify samma aako xa");
  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET_KEY);
    const payload = getUserPayload(decoded);
    if (token) {
      return payload;
    }
    throw new AuthenticationError(UN_AUTH_ERR_MSG);
  } catch (error) {
    logger.error(error);
    throw new AuthenticationError(UN_AUTH_ERR_MSG);
  }
};

export async function userRegistrationService(
  prisma: PrismaClient,
  params: RegisterInput,
) {
  try {
    await registerSchema.validate(params, {
      abortEarly: false,
    });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "register user" });
  }

  try {
    const { email, password, mobile, name } = params;

    const isUserExist = await getUserByEmailOrMobile(prisma, email, mobile);

    if (isUserExist) {
      // await sendVerificationCodeService(
      //   isUserExist.id,
      //   isUserExist.email,
      //   host,
      // );
      // return isUserExist.id;
    }

    const hashPassword = await hash(password);

    const user = await createUser(prisma, {
      email,
      mobile,
      name,
      password: hashPassword,
    });

    // await sendVerificationCodeService(user.id, email, host);

    return user.id;
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateCreationErrorMessage("User"));
  }
}

export async function loginService(
  prisma: PrismaClient,
  params: LoginInput,
  res: Response,
) {
  try {
    await loginSchema.validate(params, {
      abortEarly: false,
    });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "login user" });
  }

  try {
    const { emailOrMobile } = params;

    const user = await getUserByEmailOrMobile(
      prisma,
      emailOrMobile,
      emailOrMobile,
    );

    if (!user) {
      return new ForbiddenError(generateNotExistErrorMessage("User"));
    }

    const isValidPassword = await verify(user.password, params.password);

    if (!isValidPassword) {
      return new UserInputError(INVALID_CREDENTIAL);
    }

    const { accessToken, refreshToken } = await generateTokensService(user);

    res.cookie("accessToken", accessToken, {
      maxAge: ms(config.ACCESS_TOKEN_EXPIRES),
    });
    res.cookie("role", user?.role, {
      maxAge: ms(config.ACCESS_TOKEN_EXPIRES),
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms(config.REFRESH_TOKEN_EXPIRES),
    });
    return { user };
  } catch (error) {
    logger.error(error);
    return new UnknownError(AUTH_FAIL_ERR_MSG);
  }
}

export async function logoutService(user: User, req: Request, res: Response) {
  try {
    const jwt = req.cookies?.jwt;
    if (!jwt) {
      return new ForbiddenError("Logout failed.");
    }
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("role", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return user.id;
  } catch (error) {
    logger.error(error);
    return new UnknownError("Logout failed.");
  }
}
export async function tokenService(
  prisma: PrismaClient,
  refreshToken?: string,
) {
  try {
    if (!refreshToken) {
      return new AuthenticationError(UN_AUTH_ERR_MSG);
    }

    const user = await verifyRefreshToken(refreshToken);

    const isExist = await getUserById(prisma, user.id);


    if (!isExist) {
      return new AuthenticationError(UN_AUTH_ERR_MSG);
    }

    const accessToken = await generateToken(
      isExist,
      config.ACCESS_TOKEN_SECRET_KEY,
      config.ACCESS_TOKEN_EXPIRES,
    );
    console.log(accessToken, "gensucces");

    return accessToken;
  } catch (error) {
    logger.error(error);
    return new AuthenticationError(UN_AUTH_ERR_MSG);
  }
}

export async function userService(prisma: PrismaClient, id: string) {
  try {
    const user = await getUserById(prisma, id);
    return user ?? new ForbiddenError(generateNotExistErrorMessage("User"));
  } catch (error) {
    return new UnknownError(generateFetchErrorMessage("User"));
  }
}

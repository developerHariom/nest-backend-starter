import { PrismaClient, User } from "@prisma/client";
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
  updateAuthorStatusToVerified,
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
  generateRefreshTokenKeyName,
  generateUserVerificationKey,
} from "@/utils/constants";
import redisClient from "@/utils/redis";
import type {
  IDParams,
  LoginInput,
  RegisterInput,
  UserWithAvatar,
  VerifyUserParams,
} from "@/utils/types";
import { idParamsSchema } from "@/validations";
import {
  loginSchema,
  registerSchema,
  verifyUserSchema,
} from "@/validations/user";

import { sendVerificationCodeService } from "./mail";

async function generateTokensService(user: UserWithAvatar) {
  const accessToken = await generateToken(
    user,
    config.ACCESS_TOKEN_SECRET_KEY,
    config.ACCESS_TOKEN_EXPIRES,
  );

  const refreshToken = await generateToken(
    user,
    config.REFRESH_TOKEN_SECRET_KEY,
    config.REFRESH_TOKEN_EXPIRES,
    true,
  );

  return { accessToken, refreshToken } as const;
}

const verifyRefreshToken = async (token: string) => {
  console.log(token, "verify samma aako xa");
  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET_KEY);
    const payload = getUserPayload(decoded);

    // const value = await redisClient.get(
    //   generateRefreshTokenKeyName(payload.id),
    // );

    // console.log(value)
    if (token) {
      return payload;
    }
    // redisClient.del(generateRefreshTokenKeyName(payload.id));

    throw new AuthenticationError(UN_AUTH_ERR_MSG);
  } catch (error) {
    logger.error(error);
    throw new AuthenticationError(UN_AUTH_ERR_MSG);
  }
};

export async function userRegistrationService(
  prisma: PrismaClient,
  params: RegisterInput,
  host: string,
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
      await sendVerificationCodeService(
        isUserExist.id,
        isUserExist.email,
        host,
      );
      return isUserExist.id;
    }

    const hashPassword = await hash(password);

    const user = await createUser(prisma, {
      email,
      mobile,
      name,
      password: hashPassword,
    });

    await sendVerificationCodeService(user.id, email, host);

    return user.id;
  } catch (error) {
    logger.error(error);
    return new UnknownError(generateCreationErrorMessage("User"));
  }
}

export async function resendActivationService(
  prisma: PrismaClient,
  params: IDParams,
  host: string,
) {
  try {
    await idParamsSchema.validate(params, {
      abortEarly: false,
    });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "resend activation" });
  }

  try {
    const user = await getUserById(prisma, params.id);

    if (!user) {
      return new ForbiddenError(generateNotExistErrorMessage("User"));
    }

    const { authorStatus, email, id } = user;

    if (authorStatus === "VERIFIED") {
      return new ForbiddenError("User already verified");
    }

    await sendVerificationCodeService(id, email, host);

    return id;
  } catch (error) {
    logger.error(error);
    return new UnknownError("Resend activation failed");
  }
}

export async function verifyUserService(
  prisma: PrismaClient,
  params: VerifyUserParams,
) {
  try {
    await verifyUserSchema.validate(params, {
      abortEarly: false,
    });
  } catch (error) {
    logger.error(error);
    return formatError(error, { key: "verify user" });
  }

  try {
    const { id, code } = params;
    const user = await getUserById(prisma, id);

    if (!user) {
      return new ForbiddenError(generateNotExistErrorMessage("User"));
    }

    const { authorStatus } = user;

    if (authorStatus === "VERIFIED") {
      return new ForbiddenError("User already verified");
    }

    const VRKey = generateUserVerificationKey(id);

    const redisCode = await redisClient.get(VRKey);

    if (code !== redisCode) {
      return new ForbiddenError("User verification failed");
    }

    await redisClient.del(VRKey);
    await updateAuthorStatusToVerified(prisma, id);

    return id;
  } catch (error) {
    logger.error(error);
    return new UnknownError("User verification failed");
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

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: true, // https
      sameSite: "none", // cross-site cookie
      maxAge: ms(config.REFRESH_TOKEN_EXPIRES), // cookie expiry
    });
    return accessToken;
  } catch (error) {
    logger.error(error);
    return new UnknownError(AUTH_FAIL_ERR_MSG);
  }
}

export async function logoutService(
  user: User,
  req: Request,
  res: Response,
) {
  try {
    const jwt = req.cookies?.jwt;
    if (!jwt) {
      return new ForbiddenError("Logout failed.");
    }

    await redisClient.del(generateRefreshTokenKeyName(user.id));

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });

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

    console.log(refreshToken,"yo refresh")
   

    if (!refreshToken) {
      return new AuthenticationError(UN_AUTH_ERR_MSG);
    }

    const user = await verifyRefreshToken(refreshToken);

    const isExist = await getUserById(prisma, user.id);

    console.log(isExist);

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

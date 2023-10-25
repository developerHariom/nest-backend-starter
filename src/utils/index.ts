import { GraphQLError } from "graphql";

import { Seller, User } from "@prisma/client";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ValidationError } from "yup";

import { AuthenticationError, UserInputError } from "../model";
import config from "./config";
import {
  INTERNAL_SERVER_ERROR,
  UN_AUTH_ERR_MSG,
  generateValidationErrorMessage,
} from "./constants";

// Sub exports
export { default as createContext } from "./context";

export const formatYupError = (err: ValidationError) => {
  const errors: { path?: string; message: string }[] = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};

export function formatError(
  error: unknown,
  options?: {
    /** If you want to set custom message. */
    message?: string;
    /** Indicate the field that failed validation. */
    key?: string;
    /** Code for error. */
    code?: string;
  },
) {
  if (error instanceof ValidationError) {
    return new UserInputError(generateValidationErrorMessage(options?.key), {
      fields: formatYupError(error),
    });
  }

  return new GraphQLError(options?.message || "Something went wrong.", {
    extensions: { code: options?.code || INTERNAL_SERVER_ERROR },
  });
}

export function getUserPayload(decoded: string | JwtPayload) {
  if (
    typeof decoded === "object" &&
    "id" in decoded &&
    "name" in decoded &&
    "email" in decoded &&
    "mobile" in decoded &&
    "role" in decoded &&
    "authorStatus" in decoded
  ) {
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      mobile: decoded.mobile,
      role: decoded.role,
      authorStatus: decoded.authorStatus,
    } as User;
  }

  throw new AuthenticationError(UN_AUTH_ERR_MSG);
}
export function getSellerPayload(decoded: JwtPayload): Seller {
  if (
    typeof decoded === "object" &&
    "id" in decoded &&
    "firstName" in decoded &&
    "lastName" in decoded &&
    "email" in decoded &&
    "contact" in decoded &&
    "role" in decoded &&
    "country" in decoded &&
    "address" in decoded &&
    "shopName" in decoded &&
    "shopAddress" in decoded
  ) {
    return {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      contact: decoded.contact,
      role: decoded.role,
      country: decoded.country,
      address: decoded.address,
      shopName: decoded.shopName,
      shopAddress: decoded.shopAddress,
    } as Seller;
  }

  throw new AuthenticationError(UN_AUTH_ERR_MSG);
}

export const verifyAccessTokenInContext = (request: Request): any => {
  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return null;
    }
    const token = authToken.replace(/^Bearer\s/, "");
    const decoded = verify(token, config.ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
    if (decoded?.role) {
      if (decoded.role === "USER") {
        return getUserPayload(decoded) as User;
      } else if (decoded.role === "SELLER") {
        return getSellerPayload(decoded) as Seller;
      }
    }
  } catch (error) {
    return null;
  }
};

export const generateToken = async (
  user: User | Seller,
  key: string,
  expires: string,
) => {
  const token = sign({ ...user }, key, {
    expiresIn: expires,
  });
  return token;
};

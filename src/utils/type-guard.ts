import { has } from "lodash";

import {
  IExtensionsWithAuthorization,
  IVerifyResetPassword,
} from "./interfaces";


export const isDev = () => process.env.NODE_ENV === "development";


export function isVowel(value: string) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const firstChar = value.charAt(0).toLowerCase();
  return vowels.has(firstChar);
}


export function isObjectWithKeys<T extends object>(
  data: unknown,
  keys: (keyof T)[],
): data is T {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  return keys.every((key) => has(data, key));
}


export function isVerifyResetPassword(
  data: unknown,
): data is IVerifyResetPassword {
  return isObjectWithKeys<IVerifyResetPassword>(data, ["code", "hash"]);
}


export function isExtensionsWithAuthorization(
  extensions: unknown,
): extensions is IExtensionsWithAuthorization {
  return (
    isObjectWithKeys<IExtensionsWithAuthorization>(extensions, ["headers"]) &&
    isObjectWithKeys<IExtensionsWithAuthorization["headers"]>(
      extensions.headers,
      ["Authorization"],
    )
  );
}

// export function isAuthenticateUser(user: UserWithAvatar | null) {
//   if (user === null) {
//     throw new AuthenticationError();
//   }
//   if (user.role === "ADMIN") {
//     return user;
//   }

//   if (user.authorStatus !== "VERIFIED") {
//     throw new ForbiddenError(VERIFIED_AUTHOR_ERR_MSG);
//   }

//   return { ...user, role: "AUTHOR", authorStatus: "VERIFIED" } as const;
// }

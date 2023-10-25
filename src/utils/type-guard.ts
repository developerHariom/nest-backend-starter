
export const isDev = () => process.env.NODE_ENV === "development";



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

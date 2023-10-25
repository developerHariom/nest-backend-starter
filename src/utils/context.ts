
import { verifyAccessTokenInContext } from ".";
import prisma from "./db-client";

import {  YogaContextType } from "./types";


export default function createContext({ request, ...rest }: YogaContextType) {
  const user = verifyAccessTokenInContext(request);
  console.log(user,"user")
 
  return { ...rest, request, prisma, user } as const;
}

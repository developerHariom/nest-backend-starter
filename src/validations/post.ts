
import * as yup from "yup";


import {

  generateRequiredErrorMessage,

} from "@/utils/constants";

import { cursorParamsSchema, idParamsSchema, offsetParamsSchema } from ".";

export const createPostSchema = yup.object({
  title: yup.string().required(generateRequiredErrorMessage("Title")),
  
  content: yup.string().required(generateRequiredErrorMessage("Content")),
  
});

export const updatePostSchema = yup.object({
  id: yup.string().required(generateRequiredErrorMessage("Post ID")),
  title: yup.string(),
 
  content: yup.string(),
 
});

export const postsByTagSchema = offsetParamsSchema.shape({
  // role: yup
  //   .string()
  //   .required(generateRequiredErrorMessage("Role"))
  //   .oneOf<UserRole>(
  //     ["ADMIN", "AUTHOR"],
  //     generateEitherErrorMessage("Role", "AUTHOR", "ADMIN"),
  //   ),
  tag: yup.string().required(generateRequiredErrorMessage("Tag")),
});

export const postReactedBySchema = idParamsSchema.concat(cursorParamsSchema);


import * as yup from "yup";


import {

  generateRequiredErrorMessage,

} from "@/utils/constants";



export const createPostSchema = yup.object({
  title: yup.string().required(generateRequiredErrorMessage("Title")),
  
  content: yup.string().required(generateRequiredErrorMessage("Content")),
  
});

export const updatePostSchema = yup.object({
  id: yup.string().required(generateRequiredErrorMessage("Post ID")),
  title: yup.string(),
 
  content: yup.string(),
 
});



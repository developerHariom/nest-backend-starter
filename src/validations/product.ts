import * as yup from "yup";

import { generateRequiredErrorMessage } from "@/utils/constants";

export const createProductSchema = yup.object().shape({
  name: yup.string().required(generateRequiredErrorMessage("Product Name")),
  description: yup
    .string()
    .required(generateRequiredErrorMessage("Product Description")),
  category: yup
    .string()
    .required(generateRequiredErrorMessage("Product Category")),
  originalPrice: yup
    .number()
    .required(generateRequiredErrorMessage("Original Price")),
  stock: yup.number().required(generateRequiredErrorMessage("Stock")),
  discountPrice: yup
    .number()
    .required(generateRequiredErrorMessage("Discount Price")),
  images: yup.array().of(
    yup.object().shape({
      public_id: yup
        .string()
        .required(generateRequiredErrorMessage("Image Public ID")),
      imgSrc: yup
        .string()
        .required(generateRequiredErrorMessage("Image Source URL")),
    }),
  ),
});

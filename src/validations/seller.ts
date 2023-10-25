import * as yup from "yup";

import {
  INVALID_EMAIL,
  PASSWORD_NOT_LONG_ENOUGH,
  PASSWORD_TOO_LONG,
  generateMatchedErrorMessage,
  generateRequiredErrorMessage,
} from "@/utils/constants";

export const sellerRegisterSchema = yup.object({
  email: yup
    .string()
    .required(generateRequiredErrorMessage("Email"))
    .email(INVALID_EMAIL),
  contact: yup
    .string()
    .required(generateRequiredErrorMessage("Contact Number")),
  firstName: yup.string().required(generateRequiredErrorMessage("First Name")),
  lastName: yup.string().required(generateRequiredErrorMessage("Last Name")),
  country: yup.string().required(generateRequiredErrorMessage("Country")),
  address: yup.string().required(generateRequiredErrorMessage("Address")),
  shopName: yup.string().required(generateRequiredErrorMessage("Shop Name")),
  shopAddress: yup
    .string()
    .required(generateRequiredErrorMessage("Shop Address")),
  password: yup
    .string()
    .required(generateRequiredErrorMessage("Password"))
    .min(3, PASSWORD_NOT_LONG_ENOUGH)
    .max(255, PASSWORD_TOO_LONG),
  confirmPassword: yup
    .string()
    .required(generateRequiredErrorMessage("Confirm password"))
    .oneOf(
      [yup.ref("password"), null],
      generateMatchedErrorMessage("Password"),
    ),
});


export const sellerLoginSchema = yup.object({
  email: yup
    .string()
    .required(generateRequiredErrorMessage("Email")),
  password: yup.string().required(generateRequiredErrorMessage("password")),
});



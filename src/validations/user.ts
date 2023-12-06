import * as yup from "yup";

import {
  INVALID_EMAIL,
  PASSWORD_NOT_LONG_ENOUGH,
  PASSWORD_TOO_LONG,
  VALID_EMAIL_REGEX,
  VALID_MOBILE_REGEX,
  generateInvalidErrorMessage,
  generateMatchedErrorMessage,
  generateRequiredErrorMessage,
} from "@/utils/constants";


export const userEmailMobileSchema = yup.object({
  email: yup
    .string()
    .required(generateRequiredErrorMessage("Email"))
    .email(INVALID_EMAIL),
  mobile: yup
    .string()
    .required(generateRequiredErrorMessage("Mobile"))
  
});

export const registerSchema = userEmailMobileSchema.shape({
  name: yup.string(),
  password: yup
    .string()
    .required(generateRequiredErrorMessage("Password"))
    .min(3, PASSWORD_NOT_LONG_ENOUGH)
    .max(255, PASSWORD_TOO_LONG),
  confirmPassword: yup
    .string()
    .required(generateRequiredErrorMessage("Confirm password"))
    .oneOf(
      [yup.ref("password")],
      generateMatchedErrorMessage("Password"),
    ),
});


export const loginSchema = yup.object({
  emailOrMobile: yup
    .string()
    .required(generateRequiredErrorMessage("Email/Mobile"))
    .test(
      "validMobile",
      generateInvalidErrorMessage("Email/Mobile"),
      (value) => {
        return (
          !!value &&
          (VALID_MOBILE_REGEX.test(value) || VALID_EMAIL_REGEX.test(value))
        );
      },
    ),
  password: yup.string().required(generateRequiredErrorMessage("password")),
});



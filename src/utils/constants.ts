/* eslint-disable no-useless-escape */

// Error Messages
export const INVALID_CREDENTIAL = "Invalid email, phone or password";
export const INVALID_EMAIL = "Enter a valid email";
export const PASSWORD_NOT_LONG_ENOUGH =
  "Password must be at least 6 characters";
export const PASSWORD_TOO_LONG =
  "Password must be less than or equal 255 characters";


export const UN_AUTH_ERR_MSG = "You are not authorized";
export const AUTH_FAIL_ERR_MSG = "Authentication failed";



export function generateNotExistErrorMessage(key: string): string {
  return `${key} does not exist.`;
}

export function generateRequiredErrorMessage(key: string): string {
  return `${key} is required.`;
}

export function generateInvalidErrorMessage(key: string): string {
  return `Please enter a valid ${key}.`;
}

export function generateMatchedErrorMessage(key: string): string {
  return `${key} must match.`;
}

export function generateCreationErrorMessage(entityName: string): string {
  return `Failed to create ${entityName}.`;
}

export function generateFetchErrorMessage(entityName: string): string {
  return `Failed to fetch ${entityName}.`;
}

export function generateUpdateErrorMessage(entityName: string): string {
  return `${entityName} update failed.`;
}

export function generateDeleteErrorMessage(entityName: string): string {
  return `${entityName} delete failed.`;
}

export function generateValidationErrorMessage(key?: string) {
  return key ? `Validation failed for ${key}.` : "Validation failed.";
}

export function generateNotDefinedErrorMessage(entityName: string) {
  return `${entityName} need to be defined.`;
}



export const VALID_MOBILE_REGEX = /^(\+\d{1,3}[- ]?)?\d{11}$/;

export const VALID_EMAIL_REGEX =
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

// GraphqlYogaErrorCode
export const UN_AUTH_EXT_ERR_CODE = "UNAUTHENTICATED";

export const RATE_LIMIT_EXCEED = "RATE_LIMIT_EXCEED";
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
export const VERIFIED_SELLER_ERROR_MESSAGE="YOU MUST BE SELLER"
export const FORBIDDEN = "FORBIDDEN";
export const NO_CONTENT = "NO_CONTENT";
export const NOT_EXIST = "NOT_EXIST";
export const BAD_USER_INPUT = "BAD_USER_INPUT";
export const GRAPHQL_VALIDATION_FAILED = "GRAPHQL_VALIDATION_FAILED";
export const PERSISTED_QUERY_NOT_SUPPORTED = "PERSISTED_QUERY_NOT_SUPPORTED";
export const PERSISTED_QUERY_NOT_FOUND = "PERSISTED_QUERY_NOT_FOUND";
export const GRAPHQL_PARSE_FAILED = "GRAPHQL_PARSE_FAILED"; // The GraphQL operation string contains a syntax error.

export const SIGNALS = ["SIGINT", "SIGTERM", "SIGHUP"] as const;

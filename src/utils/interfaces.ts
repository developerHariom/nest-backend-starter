


export interface IPostPayload {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IErrorResponse {
  success: boolean;
  detail: string | null;
  message: string;
  error: string;
  timeStamp: string;
}

export interface ISuccessResponse<T> {
  success: boolean;
  detail: string | null;
  message: string;
  data: T;
  timeStamp: string;
}

export interface IVerifyResetPassword {
  code: string;
  hash: string;
}

export interface IExtensionsWithAuthorization {
  headers: {
    Authorization?: string;
  };
}

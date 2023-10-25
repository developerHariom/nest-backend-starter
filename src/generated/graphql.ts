export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum AuthorStatus {
  Pending = 'PENDING',
  Verified = 'VERIFIED'
}

export type CreatePostInput = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type CreateProductInput = {
  category: Scalars['String'];
  description: Scalars['String'];
  discountPrice: Scalars['Int'];
  images: Array<ImageInput>;
  name: Scalars['String'];
  originalPrice: Scalars['Int'];
  stock: Scalars['Int'];
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  imgSrc: Scalars['String'];
  product?: Maybe<Product>;
  public_id: Scalars['String'];
};

export type ImageInput = {
  imgSrc: Scalars['String'];
  public_id: Scalars['String'];
};

export type LoginInput = {
  emailOrMobile: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  seller?: Maybe<Seller>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createProduct: Product;
  deletePost: Scalars['ID'];
  login: LoginResponse;
  logout: Scalars['ID'];
  register: Scalars['ID'];
  resendActivation: Scalars['ID'];
  sellerLogin: LoginResponse;
  sellerRegister: Scalars['ID'];
  updatePost: Post;
  verifyUser: Scalars['ID'];
};


export type MutationCreatePostArgs = {
  data?: InputMaybe<CreatePostInput>;
};


export type MutationCreateProductArgs = {
  data?: InputMaybe<CreateProductInput>;
};


export type MutationDeletePostArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  data?: InputMaybe<LoginInput>;
};


export type MutationRegisterArgs = {
  data?: InputMaybe<RegisterInput>;
};


export type MutationResendActivationArgs = {
  id: Scalars['ID'];
};


export type MutationSellerLoginArgs = {
  data?: InputMaybe<SellerLoginInput>;
};


export type MutationSellerRegisterArgs = {
  data?: InputMaybe<SellerRegisterInput>;
};


export type MutationUpdatePostArgs = {
  data?: InputMaybe<UpdatePostInput>;
};


export type MutationVerifyUserArgs = {
  code: Scalars['String'];
  id: Scalars['ID'];
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  category: Scalars['String'];
  createdAt: Scalars['String'];
  description: Scalars['String'];
  discountPrice: Scalars['Int'];
  id: Scalars['ID'];
  images: Array<Image>;
  name: Scalars['String'];
  originalPrice: Scalars['Int'];
  seller?: Maybe<Seller>;
  soldOut?: Maybe<Scalars['Int']>;
  stock?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  post: Post;
  token: Scalars['String'];
  trendingPosts: Array<Post>;
  user: User;
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};


export type QueryTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type RegisterInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  mobile: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
};

export enum RegisterUserRole {
  Author = 'AUTHOR',
  User = 'USER'
}

export type Seller = {
  __typename?: 'Seller';
  address?: Maybe<Scalars['String']>;
  contact: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  role: UserRole;
  shopAddress?: Maybe<Scalars['String']>;
  shopName?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type SellerLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SellerRegisterInput = {
  address: Scalars['String'];
  confirmPassword: Scalars['String'];
  contact: Scalars['String'];
  country: Scalars['String'];
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  password: Scalars['String'];
  shopAddress: Scalars['String'];
  shopName: Scalars['String'];
};

export type TagInput = {
  title: Scalars['String'];
};

export type Tokens = {
  __typename?: 'Tokens';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  authorStatus?: Maybe<AuthorStatus>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  mobile: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  role: UserRole;
  updatedAt: Scalars['String'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Seller = 'SELLER',
  User = 'USER'
}

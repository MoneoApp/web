/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user_customer_devices {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
}

export interface UserQuery_user_customer {
  __typename: "Customer";
  id: string;
  devices: UserQuery_user_customer_devices[];
}

export interface UserQuery_user {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
  customer: UserQuery_user_customer;
}

export interface UserQuery {
  user: UserQuery_user | null;
}

export interface UserQueryVariables {
  id: string;
}

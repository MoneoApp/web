/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL query operation: CustomerQuery
// ====================================================

export interface CustomerQuery_customer_users {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
}

export interface CustomerQuery_customer {
  __typename: "Customer";
  id: string;
  users: CustomerQuery_customer_users[];
}

export interface CustomerQuery {
  customer: CustomerQuery_customer | null;
}

export interface CustomerQueryVariables {
  id: string;
}

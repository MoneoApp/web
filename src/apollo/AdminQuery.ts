/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL query operation: AdminQuery
// ====================================================

export interface AdminQuery_me_customer {
  __typename: "Customer";
  id: string;
  name: string;
}

export interface AdminQuery_me {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
  customer: AdminQuery_me_customer;
}

export interface AdminQuery {
  /**
   * Get the current authenticated user object.
   */
  me: AdminQuery_me;
}

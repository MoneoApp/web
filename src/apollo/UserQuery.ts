/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
}

export interface UserQuery {
  /**
   * Get the details of the specified user. Only accessible by roles: ADMIN, CONTACT, CURRENT.
   */
  user: UserQuery_user | null;
}

export interface UserQueryVariables {
  id: string;
}

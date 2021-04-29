/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: IndexMutation
// ====================================================

export interface IndexMutation_login_user {
  __typename: "User";
  role: UserRole;
}

export interface IndexMutation_login {
  __typename: "Authentication";
  token: string;
  user: IndexMutation_login_user;
}

export interface IndexMutation {
  login: IndexMutation_login;
}

export interface IndexMutationVariables {
  email: string;
  password: string;
}

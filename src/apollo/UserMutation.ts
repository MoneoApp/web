/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UserMutation
// ====================================================

export interface UserMutation_updateUser {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
}

export interface UserMutation {
  /**
   * Update the specified user. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.
   */
  updateUser: UserMutation_updateUser | null;
}

export interface UserMutationVariables {
  id: string;
  email: string;
  type: UserType;
}

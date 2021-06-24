/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUserMutation
// ====================================================

export interface DeleteUserMutation_deleteUser {
  __typename: "User";
  id: string;
}

export interface DeleteUserMutation {
  /**
   * Delete the specified user. Only accessible by roles: ADMIN, CONTACT, CURRENT. If CONTACT, must be part of the same customer network.
   */
  deleteUser: DeleteUserMutation_deleteUser | null;
}

export interface DeleteUserMutationVariables {
  id: string;
}

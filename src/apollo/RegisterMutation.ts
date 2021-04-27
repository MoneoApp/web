/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterMutation
// ====================================================

export interface RegisterMutation_createUser {
  __typename: "User";
  id: string;
}

export interface RegisterMutation {
  createUser: RegisterMutation_createUser;
}

export interface RegisterMutationVariables {
  inviteId: string;
  password: string;
}

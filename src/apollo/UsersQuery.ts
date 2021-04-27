/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UsersQuery
// ====================================================

export interface UsersQuery_users {
  __typename: 'User';
  id: string;
  email: string;
  role: string;
}

export interface UsersQuery {
  users: UsersQuery_users[];
}

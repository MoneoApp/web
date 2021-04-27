/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UsersQuery
// ====================================================

export interface UsersQuery_users_devices {
  __typename: "Device";
  id: string;
}

export interface UsersQuery_users {
  __typename: "User";
  id: string;
  email: string;
  role: string;
  devices: UsersQuery_users_devices[];
}

export interface UsersQuery {
  users: UsersQuery_users[];
}

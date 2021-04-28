/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user_devices {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
}

export interface UserQuery_user {
  __typename: "User";
  id: string;
  email: string;
  role: string;
  devices: UserQuery_user_devices[];
}

export interface UserQuery {
  user: UserQuery_user | null;
}

export interface UserQueryVariables {
  id: string;
}

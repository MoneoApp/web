/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL query operation: UsersQuery
// ====================================================

export interface UsersQuery_users_customer_devices {
  __typename: "Device";
  id: string;
}

export interface UsersQuery_users_customer {
  __typename: "Customer";
  id: string;
  devices: UsersQuery_users_customer_devices[];
}

export interface UsersQuery_users {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
  customer: UsersQuery_users_customer;
}

export interface UsersQuery {
  users: UsersQuery_users[];
}

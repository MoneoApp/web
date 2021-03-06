/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserType } from "./globalTypes";

// ====================================================
// GraphQL query operation: CustomerQuery
// ====================================================

export interface CustomerQuery_customer_users {
  __typename: "User";
  id: string;
  email: string;
  type: UserType;
}

export interface CustomerQuery_customer_devices {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
}

export interface CustomerQuery_customer {
  __typename: "Customer";
  id: string;
  users: CustomerQuery_customer_users[];
  devices: CustomerQuery_customer_devices[];
}

export interface CustomerQuery {
  /**
   * Get the details of the specified customer. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.
   */
  customer: CustomerQuery_customer | null;
}

export interface CustomerQueryVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCustomerMutation
// ====================================================

export interface CreateCustomerMutation_createCustomer_users {
  __typename: "User";
  id: string;
}

export interface CreateCustomerMutation_createCustomer_devices {
  __typename: "Device";
  id: string;
}

export interface CreateCustomerMutation_createCustomer {
  __typename: "Customer";
  id: string;
  name: string;
  users: CreateCustomerMutation_createCustomer_users[];
  devices: CreateCustomerMutation_createCustomer_devices[];
}

export interface CreateCustomerMutation {
  /**
   * Create a customer. Invites the specified email as CONTACT user. Only accessible by roles: ADMIN.
   */
  createCustomer: CreateCustomerMutation_createCustomer;
}

export interface CreateCustomerMutationVariables {
  name: string;
  email: string;
}

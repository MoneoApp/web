/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CustomersQuery
// ====================================================

export interface CustomersQuery_customers_users {
  __typename: "User";
  id: string;
}

export interface CustomersQuery_customers_devices {
  __typename: "Device";
  id: string;
}

export interface CustomersQuery_customers {
  __typename: "Customer";
  id: string;
  name: string;
  users: CustomersQuery_customers_users[];
  devices: CustomersQuery_customers_devices[];
}

export interface CustomersQuery {
  customers: CustomersQuery_customers[];
}

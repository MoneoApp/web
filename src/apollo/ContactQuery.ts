/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContactQuery
// ====================================================

export interface ContactQuery_me_customer {
  __typename: "Customer";
  id: string;
}

export interface ContactQuery_me {
  __typename: "User";
  id: string;
  customer: ContactQuery_me_customer;
}

export interface ContactQuery {
  me: ContactQuery_me;
}

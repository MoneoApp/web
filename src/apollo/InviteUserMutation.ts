/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteUserMutation
// ====================================================

export interface InviteUserMutation {
  /**
   * Create an invite for the specified customer. Sends an email to the specified email address. Only accessible by roles: ADMIN, CONTACT.
   */
  inviteUser: boolean;
}

export interface InviteUserMutationVariables {
  customerId: string;
  email: string;
}

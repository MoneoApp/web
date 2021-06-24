/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteManualMutation
// ====================================================

export interface DeleteManualMutation_deleteManual {
  __typename: "Manual";
  id: string;
}

export interface DeleteManualMutation {
  /**
   * Delete the specified manual. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.
   */
  deleteManual: DeleteManualMutation_deleteManual | null;
}

export interface DeleteManualMutationVariables {
  id: string;
}

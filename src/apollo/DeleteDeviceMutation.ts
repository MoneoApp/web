/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteDeviceMutation
// ====================================================

export interface DeleteDeviceMutation_deleteDevice {
  __typename: "Device";
  id: string;
}

export interface DeleteDeviceMutation {
  /**
   * Delete the specified device. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.
   */
  deleteDevice: DeleteDeviceMutation_deleteDevice | null;
}

export interface DeleteDeviceMutationVariables {
  id: string;
}

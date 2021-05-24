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
  deleteDevice: DeleteDeviceMutation_deleteDevice | null;
}

export interface DeleteDeviceMutationVariables {
  id: string;
}

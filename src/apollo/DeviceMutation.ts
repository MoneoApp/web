/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeviceMutation
// ====================================================

export interface DeviceMutation_updateDevice {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
}

export interface DeviceMutation {
  updateDevice: DeviceMutation_updateDevice | null;
}

export interface DeviceMutationVariables {
  id: string;
  model: string;
  brand: string;
}

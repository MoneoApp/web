/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeviceType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: NewDeviceMutation
// ====================================================

export interface NewDeviceMutation_createDevice {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
}

export interface NewDeviceMutation {
  createDevice: NewDeviceMutation_createDevice;
}

export interface NewDeviceMutationVariables {
  model: string;
  brand: string;
  image: any;
  type: DeviceType;
}

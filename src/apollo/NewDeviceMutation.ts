/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeviceType, UpsertInteraction } from "./globalTypes";

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
  /**
   * Create a device with the specified details. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.
   */
  createDevice: NewDeviceMutation_createDevice;
}

export interface NewDeviceMutationVariables {
  model: string;
  brand: string;
  image: any;
  type: DeviceType;
  mlImages?: any | null;
  interactions: UpsertInteraction[];
}

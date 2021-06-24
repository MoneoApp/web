/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpsertInteraction, DeviceType, InteractionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeviceMutation
// ====================================================

export interface DeviceMutation_updateDevice_interactions {
  __typename: "Interaction";
  id: string;
  type: InteractionType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface DeviceMutation_updateDevice {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
  type: DeviceType;
  interactions: DeviceMutation_updateDevice_interactions[];
}

export interface DeviceMutation {
  /**
   * Update the specified device. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.
   */
  updateDevice: DeviceMutation_updateDevice | null;
}

export interface DeviceMutationVariables {
  id: string;
  model: string;
  brand: string;
  image?: any | null;
  interactions: UpsertInteraction[];
}

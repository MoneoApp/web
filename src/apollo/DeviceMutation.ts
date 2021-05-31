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
  title: string;
  description: string;
  type: InteractionType;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

export interface DeviceMutation_updateDevice {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
  image: string;
  type: DeviceType;
  interactions: DeviceMutation_updateDevice_interactions[];
}

export interface DeviceMutation {
  updateDevice: DeviceMutation_updateDevice | null;
}

export interface DeviceMutationVariables {
  id: string;
  model: string;
  brand: string;
  image?: any | null;
  interactions: UpsertInteraction[];
}

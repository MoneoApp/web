/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeviceType, InteractionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: DeviceQuery
// ====================================================

export interface DeviceQuery_device_interactions {
  __typename: "Interaction";
  id: string;
  type: InteractionType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface DeviceQuery_device_manuals_steps {
  __typename: "ManualStep";
  id: string;
}

export interface DeviceQuery_device_manuals {
  __typename: "Manual";
  id: string;
  title: string;
  steps: DeviceQuery_device_manuals_steps[];
}

export interface DeviceQuery_device {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
  type: DeviceType;
  interactions: DeviceQuery_device_interactions[];
  manuals: DeviceQuery_device_manuals[];
}

export interface DeviceQuery {
  /**
   * Get the details of the specified device.
   */
  device: DeviceQuery_device | null;
}

export interface DeviceQueryVariables {
  id: string;
}

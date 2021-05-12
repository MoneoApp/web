/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeviceQuery
// ====================================================

export interface DeviceQuery_device_overlays_interactions {
  __typename: "Interaction";
  id: string;
}

export interface DeviceQuery_device_overlays {
  __typename: "Overlay";
  id: string;
  name: string;
  interactions: DeviceQuery_device_overlays_interactions[];
}

export interface DeviceQuery_device {
  __typename: "Device";
  id: string;
  model: string;
  brand: string;
  image: string;
  overlays: DeviceQuery_device_overlays[];
}

export interface DeviceQuery {
  device: DeviceQuery_device | null;
}

export interface DeviceQueryVariables {
  id: string;
}

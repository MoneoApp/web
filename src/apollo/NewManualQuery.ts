/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InteractionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: NewManualQuery
// ====================================================

export interface NewManualQuery_device_interactions {
  __typename: "Interaction";
  id: string;
  type: InteractionType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface NewManualQuery_device {
  __typename: "Device";
  id: string;
  interactions: NewManualQuery_device_interactions[];
}

export interface NewManualQuery {
  /**
   * Get the details of the specified device.
   */
  device: NewManualQuery_device | null;
}

export interface NewManualQueryVariables {
  id: string;
}

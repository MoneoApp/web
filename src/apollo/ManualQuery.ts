/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InteractionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: ManualQuery
// ====================================================

export interface ManualQuery_manual_steps_interactions {
  __typename: "Interaction";
  id: string;
  color: string | null;
}

export interface ManualQuery_manual_steps {
  __typename: "ManualStep";
  text: string;
  order: number;
  interactions: ManualQuery_manual_steps_interactions[];
}

export interface ManualQuery_manual_device_interactions {
  __typename: "Interaction";
  id: string;
  type: InteractionType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface ManualQuery_manual_device {
  __typename: "Device";
  id: string;
  image: string;
  interactions: ManualQuery_manual_device_interactions[];
}

export interface ManualQuery_manual {
  __typename: "Manual";
  id: string;
  title: string;
  steps: ManualQuery_manual_steps[];
  device: ManualQuery_manual_device;
}

export interface ManualQuery {
  manual: ManualQuery_manual | null;
}

export interface ManualQueryVariables {
  id: string;
}
